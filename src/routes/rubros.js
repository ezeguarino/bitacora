const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedin } = require("../lib/auth");

//Tablas BD
const T_RUBROS = "rubros";

router.get("/add", isLoggedin, (req, res) => {
  res.render("rubros/add");
});

router.post("/add", isLoggedin, async (req, res) => {
  const { nombre } = req.body;
  const newRubro = {
    nombre,
  };
  await pool.query("INSERT INTO ?? SET ?", [T_RUBROS, newRubro]);
  req.flash("success", "Agregado correctamente");
  res.redirect("/rubros");
});

router.get("/", isLoggedin, async (req, res) => {
  const rubros = await pool.query("SELECT * FROM ?? ", [T_RUBROS]);
  res.render("rubros/listrubros", { rubros });
});

router.get("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const rubros = await pool.query("SELECT * FROM ?? WHERE ID =?", [
    T_RUBROS,
    id,
  ]);
  console.log(rubros[0].nombre);
  res.render("rubros/edit", { rubro: rubros[0] });
});

router.post("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const newRubro = {
    nombre,
  };

  await pool.query("UPDATE ??  SET ? WHERE ID = ?", [T_RUBROS, newRubro, id]);
  req.flash("success", "Actualizado correctamente");
  res.redirect("/rubros");
});

router.get("/habilitar/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET habilitado=1 WHERE ID = ?", [T_RUBROS, id]);
  res.redirect("/rubros");
});

router.get("/deshabilitar/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE ?? SET habilitado=0 WHERE ID = ?", [T_RUBROS, id]);
  // req.flash("message", "El usuario ha sido DESHABILITADO");
  res.redirect("/rubros");
});

module.exports = router;
