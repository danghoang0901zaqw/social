const dotenv = require("dotenv");
dotenv.config({ path: "./.env.development" });

const db = require("../../database/models");
const { hashPassword, verifyPassword, hashToken } = require("../helpers/auth");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const STATUS_CODES = require("../constants/statusCode");
const { AUTH_MESSAGES } = require("../constants/messages");
const { AUTH_TOKEN_TYPE } = require("../constants/enum");
const { generateToken, verifyToken } = require("../utils/jwt");
const { Snowflake } = require("@sapphire/snowflake");

const snowflake = new Snowflake(1n);

class AuthServices {
  getExpiredAtFromToken({ token, tokenSecretKey }) {
    try {
      const decoded = verifyToken(token, tokenSecretKey);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }
  generateId() {
    return snowflake.generate().toString();
  }
  async signUp({ firstName, lastName, email, password, ip, userAgent }) {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(
        AUTH_MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT,
      );
    }
    const transaction = await db.sequelize.transaction();
    try {
      const hashedPassword = hashPassword(password);
      const user = await db.User.create(
        {
          userId: this.generateId(),
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
        { transaction },
      );

      const [accessToken, refreshToken] = await Promise.all([
        generateToken({
          userId: user.userId,
          secretKey: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        }),
        generateToken({
          userId: user.userId,
          secretKey: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }),
      ]);

      await db.AuthToken.create(
        {
          id: this.generateId(),
          userId: user.userId,
          type: AUTH_TOKEN_TYPE.REFRESH,
          tokenHash: hashToken(refreshToken),
          expiredAt: this.getExpiredAtFromToken({
            token: refreshToken,
            tokenSecretKey: process.env.JWT_REFRESH_SECRET,
          }),
          ip,
          userAgent,
        },
        { transaction },
      );

      await transaction.commit();

      const { password: _, ...userWithoutPassword } = user.toJSON();

      return { user: userWithoutPassword, accessToken, refreshToken };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async signIn({ email, password, ip, userAgent }) {
    const user = await db.User.findOne({ where: { email } });
    if (!user || !verifyPassword(password, user?.password)) {
      throw new AppError(
        AUTH_MESSAGES.INVALID_CREDENTIALS,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        userId: user.userId,
        secretKey: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      }),
      generateToken({
        userId: user.userId,
        secretKey: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    await db.AuthToken.create({
      id: this.generateId(),
      userId: user.userId,
      type: AUTH_TOKEN_TYPE.REFRESH,
      tokenHash: hashToken(refreshToken),
      expiredAt: this.getExpiredAtFromToken({
        token: refreshToken,
        tokenSecretKey: process.env.JWT_REFRESH_SECRET,
      }),
      usedAt: null,
      ip,
      userAgent,
    });

    const { ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenHash = hashToken(refreshToken);
    const validToken = await db.AuthToken.findOne({
      where: {
        userId: decoded.userId,
        tokenHash,
        type: AUTH_TOKEN_TYPE.REFRESH,
      },
    });
    if (!validToken) {
      throw new AppError(
        AUTH_MESSAGES.REFRESH_TOKEN_INVALID,
        STATUS_CODES.UNAUTHORIZED,
      );
    }

    if (validToken.expiredAt < new Date()) {
      throw new AppError(
        AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    const transaction = await db.sequelize.transaction();
    try {
      if (validToken.usedAt) {
        await db.AuthToken.update(
          { usedAt: new Date() },
          {
            where: {
              userId: decoded.userId,
              usedAt: null,
            },
            transaction,
          },
        );

        throw new AppError(
          AUTH_MESSAGES.TOKEN_REUSE_DETECTED,
          STATUS_CODES.UNAUTHORIZED,
        );
      }
      await validToken.update({ usedAt: new Date() }, { transaction });

      const [newAccessToken, newRefreshToken] = await Promise.all([
        generateToken({
          userId: decoded.userId,
          secretKey: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        }),
        generateToken({
          userId: decoded.userId,
          secretKey: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }),
      ]);

      await db.AuthToken.create(
        {
          id: this.generateId(),
          userId: decoded.userId,
          type: AUTH_TOKEN_TYPE.REFRESH,
          tokenHash: hashToken(newRefreshToken),
          expiredAt: this.getExpiredAtFromToken({
            token: newRefreshToken,
            tokenSecretKey: process.env.JWT_REFRESH_SECRET,
          }),
          usedAt: null,
        },
        { transaction },
      );
      await transaction.commit();
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async signOut(refreshToken) {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenHash = hashToken(refreshToken);
    const storedToken = await db.AuthToken.findOne({
      where: {
        userId: decoded.userId,
        tokenHash,
        type: AUTH_TOKEN_TYPE.REFRESH,
      },
    });
    if (!storedToken) {
      throw new AppError(
        AUTH_MESSAGES.REFRESH_TOKEN_INVALID,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    // 🔥 detect reuse
    if (storedToken.usedAt) {
      await db.AuthToken.update(
        { usedAt: new Date() },
        {
          where: {
            userId: decoded.userId,
            usedAt: null,
          },
        },
      );

      throw new AppError(
        AUTH_MESSAGES.TOKEN_REUSE_DETECTED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    await storedToken.update({
      usedAt: new Date(),
    });
    return true;
  }

  async forgotPassword(email) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(AUTH_MESSAGES.EMAIL_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    const forgotPasswordToken = generateToken({
      userId: user.userId,
      secretKey: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN,
    });
    const resetTokenHash = hashToken(forgotPasswordToken);

    await db.AuthToken.create({
      id: this.generateId(),
      userId: user.userId,
      type: AUTH_TOKEN_TYPE.RESET_PASSWORD,
      tokenHash: resetTokenHash,
      expiredAt: this.getExpiredAtFromToken({
        token: forgotPasswordToken,
        tokenSecretKey: process.env.JWT_ACCESS_SECRET,
      }),
    });
    return forgotPasswordToken;
  }

  async verifyPasswordToken(token) {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const tokenHash = hashToken(token);
    const dataToken = await db.AuthToken.findOne({
      where: {
        userId: decoded.userId,
        tokenHash,
        type: AUTH_TOKEN_TYPE.RESET_PASSWORD,
      },
    });
    const validToken = dataToken?.dataValues;
    if (!validToken) {
      throw new AppError(
        AUTH_MESSAGES.RESET_PASSWORD_TOKEN_INVALID,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (validToken.expiredAt < new Date()) {
      throw new AppError(
        AUTH_MESSAGES.RESET_PASSWORD_TOKEN_EXPIRED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (validToken.usedAt) {
      throw new AppError(
        AUTH_MESSAGES.TOKEN_REUSE_DETECTED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    await db.AuthToken.update(
      { usedAt: new Date() },
      {
        where: {
          userId: decoded.userId,
          type: AUTH_TOKEN_TYPE.RESET_PASSWORD,
        },
      },
    );
    return true;
  }

  async resetPassword(token, newPassword) {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const tokenHash = hashToken(token);
    const dataToken = await db.AuthToken.findOne({
      where: {
        userId: decoded.userId,
        tokenHash,
        type: AUTH_TOKEN_TYPE.RESET_PASSWORD,
      },
    });
    const validToken = dataToken?.dataValues;
    if (!validToken) {
      throw new AppError(
        AUTH_MESSAGES.RESET_PASSWORD_TOKEN_INVALID,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (validToken.expiredAt < new Date()) {
      throw new AppError(
        AUTH_MESSAGES.RESET_PASSWORD_TOKEN_EXPIRED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (validToken.usedAt) {
      throw new AppError(
        AUTH_MESSAGES.TOKEN_REUSE_DETECTED,
        STATUS_CODES.UNAUTHORIZED,
      );
    }
    const hashedPassword = hashPassword(newPassword);
    await db.User.update(
      { password: hashedPassword },
      { where: { userId: decoded.userId } },
    );

    return true;
  }
}

module.exports = new AuthServices();
