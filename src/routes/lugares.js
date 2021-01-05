const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedin } = require("../lib/auth");

//Tablas BD
const T_LUGARES = "lugares";
const T_RUBROS = "rubros";
const T_PAISES = "paises";

router.get("/add", isLoggedin, async (req, res) => {
  const rubros = await pool.query(
    "SELECT * FROM ?? where habilitado=1 order by nombre",
    [T_RUBROS]
  );
  const paises = await pool.query("SELECT * FROM ?? order by nombre", [
    T_PAISES,
  ]);
  res.render("lugares/add", { rubros, paises });
});

router.post("/add", isLoggedin, async (req, res) => {
  const { nombre, url, descripcion, rubro_id, pais_id } = req.body;
  const newLugar = {
    nombre,
    url,
    descripcion,
    user_id: req.user.id,
    rubro_id,
    pais_id,
  };
  await pool.query("INSERT INTO ?? set ?", [T_LUGARES, newLugar]);
  req.flash("success", "Agregado correctamente");
  res.redirect("/lugares");
});

router.get("/", isLoggedin, async (req, res) => {
  const lugares = await pool.query(
    "SELECT l.id , l.nombre ,l.url,l.descripcion, l.created_at , r.nombre as rubro_nombre, p.nombre as pais_nombre FROM ?? as l INNER JOIN ?? as r ON l.rubro_id=r.id INNER JOIN ?? as p ON l.pais_id=p.id   where user_id=?",
    [T_LUGARES, T_RUBROS, T_PAISES, req.user.id]
  );
  res.render("lugares/list", { lugares });
});

router.get("/delete/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM ?? WHERE ID = ?", [T_LUGARES, id]);
  req.flash("success", "Eliminado correctamente");
  res.redirect("/lugares");
});

router.get("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const lugares = await pool.query(
    "SELECT l.id , l.nombre ,l.url,l.descripcion, l.created_at ,r.id as rubro_id, r.nombre as rubro_nombre, p.id as pais_id, p.nombre as pais_nombre FROM ?? as l INNER JOIN ?? as r ON l.rubro_id=r.id INNER JOIN ?? as p ON l.pais_id=p.id   where l.id=?",
    [T_LUGARES, T_RUBROS, T_PAISES, id]
  );
  const rubros = await pool.query("SELECT * FROM ?? WHERE habilitado=1", [
    T_RUBROS,
  ]);
  const paises = await pool.query("SELECT * FROM ?? ", [T_PAISES]);
  res.render("lugares/edit", { lugar: lugares[0], rubros, paises });
});

router.post("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, url, rubro_id, pais_id } = req.body;
  const newLugar = {
    nombre,
    descripcion,
    url,
    rubro_id,
    pais_id,
  };
  await pool.query("UPDATE ??  SET ? WHERE ID = ?", [T_LUGARES, newLugar, id]);
  req.flash("success", "Actualizado correctamente");
  res.redirect("/lugares");
});

module.exports = router;
