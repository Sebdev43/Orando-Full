import express from "express";
import { login, verifyEmail, signup, getConnectionPage, forgotPassword, resetPassword } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateReqMiddleware.js";
import { hashPasswordMiddleware } from "../middlewares/scryptMiddleware.js";
import {
  emailValidator,
  nicknameValidator,
  passwordValidator,
} from "../validators/userValidators.js";
import { authenticateJWT } from "../middlewares/jwtMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Accounts
 *     description: Operations related to user accounts
 */


/**
 * Route pour se connecter et obtenir un token JWT
 * @swagger
 * /accounts/login:
 *   post:
 *     summary: Se connecter et obtenir un token JWT
 *     description: Permet à un utilisateur de se connecter en fournissant son email et son mot de passe. Si l'email n'est pas vérifié, un nouveau lien de vérification sera envoyé.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie et token JWT renvoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Données de requête invalides
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: Email ou mot de passe incorrect, ou email non vérifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Email ou mot de passe incorrect, ou email non vérifié
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 */

router.post("/login", login);

/**
 * @swagger
 * /accounts/signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Permet à un utilisateur de s'inscrire en fournissant un email, un mot de passe, un surnom et une localisation.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               localisation:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès. Un email de vérification a été envoyé.
 *       '400':
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       '409':
 *         description: Email or nickname already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Email or nickname already in use
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post(
  "/signup",
  [
    emailValidator,
    passwordValidator,
    nicknameValidator,
    validateRequest,
    hashPasswordMiddleware,
  ],
  signup
);



/**
 * @swagger
 * /accounts/verify-email:
 *  get:
 *   summary: Vérifier l'email de l'utilisateur
 *   description: Vérifie l'email de l'utilisateur
 *   tags: [Accounts]
 *   parameters:
 *     - in: query
 *       name: token
 *       schema:
 *         type: string
 *       required: true
 *       description: Token de vérification de l'email
 *   responses:
 *     200:
 *       description: Email vérifié avec succès
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Email vérifié avec succès
 *     400:
 *       description: Token invalide ou expiré
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 *                 example: Token invalide ou expiré
 */

router.get("/verify-email", verifyEmail);


/**
 * @swagger
 * /accounts/forgot-password:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     description: Permet de demander la réinitialisation du mot de passe en fournissant un email. Si l'email existe, un lien de réinitialisation sera envoyé.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Si un compte avec cet email existe, un email de réinitialisation de mot de passe a été envoyé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Si un compte avec cet email existe, un email de réinitialisation de mot de passe a été envoyé.
 *       400:
 *         description: Données de requête invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Données de requête invalides
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 */

router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /accounts/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     description: Permet de réinitialiser le mot de passe en fournissant le token reçu par email et le nouveau mot de passe.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe réinitialisé avec succès.
 *       400:
 *         description: Données de requête invalides ou token invalide/expiré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Données de requête invalides ou token invalide/expiré.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 */

router.post("/reset-password", resetPassword)

/**
 * Route pour rafraîchir le token JWT
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token JWT
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Refresh token manquant
 *       403:
 *         description: Refresh token invalide
 */
//router.post("/refresh-token", refreshToken);

// route Kevin test d'affichage

router.get('/connection', getConnectionPage);


export default router;
