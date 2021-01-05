const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedin } = require("../lib/auth");

//Tablas BD
const T_USUARIOS = "users";

router.get("/", isLoggedin, async (req, res) => {
  const useradmin = "admin";
  const users = await pool.query("SELECT * FROM ?? WHERE username !=?", [
    T_USUARIOS,
    useradmin,
  ]);
  res.render("users/listusers", { users });
});

router.get("/habilitar/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET habilitado=1 WHERE ID = ?", [T_USUARIOS, id]);
  // req.flash("success", "El usuario ha sido HABILITADO");
  res.redirect("/users");
});

router.get("/habilitarAdmin/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET admin=1 WHERE ID = ?", [T_USUARIOS, id]);
  // req.flash("success", "El usuario ha sido HABILITADO");
  res.redirect("/users");
});

router.get("/deshabilitar/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET habilitado=0 WHERE ID = ?", [T_USUARIOS, id]);
  // req.flash("message", "El usuario ha sido DESHABILITADO");
  res.redirect("/users");
});

router.get("/deshabilitarAdmin/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET admin=0 WHERE ID = ?", [T_USUARIOS, id]);
  // req.flash("message", "El usuario ha sido DESHABILITADO");
  res.redirect("/users");
});

module.exports = router;
