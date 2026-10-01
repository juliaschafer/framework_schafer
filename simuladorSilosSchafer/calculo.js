/*
 * Núcleo de cálculo — Ventilação de silos (resistência ao fluxo de ar).
 * Porta fiel das macros VBA da planilha Resistencia_Fluxo_de_Ar.xls
 * (executa_macro1 / calc_vaz / SelecionarMotor).
 *
 * Perda de carga por metro (Shedd):  dP/L = A·Q² / ln(1 + B·Q)   [Pa/m, Q em m³/(s·m²)]
 */
(function (root) {
  'use strict';

  /* massa: kg/m³ · repouso: graus · A, B: constantes de Shedd
     Milho tem duas faixas de vazão (corte em Q = 0,0203 m³/(s·m²)). */
  var PRODUTOS = {
    Milho: { massa: 721, repouso: 27, faixas: [
      { ate: 0.0203, A: 9970, B: 8.55 },
      { ate: Infinity, A: 20700, B: 30.4 }
    ] },
    Arroz: { massa: 570, repouso: 36, faixas: [{ ate: Infinity, A: 25700, B: 13.2 }] },
    Soja:  { massa: 772, repouso: 30, faixas: [{ ate: Infinity, A: 10200, B: 16 }] },
    Sorgo: { massa: 721, repouso: 30, faixas: [{ ate: Infinity, A: 21200, B: 8.06 }] },
    Trigo: { massa: 772, repouso: 30, faixas: [{ ate: Infinity, A: 27000, B: 8.77 }] },
    /* CANOLA — massa e repouso são valores típicos de literatura.
       A e B: PROVISÓRIOS. Conferir com a ASAE D272.3 / Jayas et al. (1987)
       antes de usar em dimensionamento. */
    Canola: { massa: 650, repouso: 26, provisorio: true, faixas: [{ ate: Infinity, A: 28000, B: 12 }] }
  };

  var MOTORES = [0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7.5, 10, 12.5, 15, 20,
                 25, 30, 40, 50, 60, 75, 100, 125, 150, 175, 200];

  function constantes(produto, qa) {
    var f = PRODUTOS[produto].faixas;
    for (var i = 0; i < f.length; i++) if (qa <= f[i].ate) return f[i];
    return f[f.length - 1];
  }

  function perdaPorMetro(c, qa) { return (c.A * qa * qa / Math.log(1 + c.B * qa)) / 1000; }
  function perdaTotal(c, qa, h) { return 1.8 * h * perdaPorMetro(c, qa) * 25.4 / 0.24884; }

  function motorComercial(pot) {
    for (var i = 0; i < MOTORES.length; i++) if (pot <= MOTORES[i]) return MOTORES[i];
    return pot;
  }

  /* Newton-Raphson de calc_vaz: vazão (m³/min) para potência fixa e altura XL1 */
  function calcVaz(xA, XL1, pot, c, netta, f1, f2) {
    var n = netta / 100, QT = pot * 10 / 60, K, FQ, FQ1, FQ2, XQ1, XQ2;
    function F(q, q2) {
      return QT * XL1 * c.A * q2 * q2 * f1 * f2 / (xA * xA * n * Math.log(1 + c.B * q2 / xA)) - pot * 75 * 9.80665;
    }
    for (K = 0; K < 100; K++) {
      FQ = F(QT, QT);
      XQ2 = 1.001 * QT; FQ2 = F(QT, XQ2);
      XQ1 = 0.999 * QT; FQ1 = F(QT, XQ1);
      QT = QT - FQ / ((FQ2 - FQ1) / (XQ2 - XQ1));
    }
    return QT * 60;
  }

  /* e: {produto, D, H, repouso, massa, qEsp, eficiencia, fCompact, fSeg} */
  function calcular(e) {
    var pi = 3.14159265, r = {};
    r.area = pi * e.D * e.D / 4;
    r.hCone = (e.D / 2) * Math.tan(e.repouso * pi / 180);
    r.volCil = r.area * e.H;
    r.volCone = r.area * r.hCone / 3;
    r.volTotal = r.volCil + r.volCone;
    r.capacidade = r.volTotal * e.massa / 1000;
    r.vazao = e.qEsp * r.capacidade;
    r.vazaoArea = r.vazao / r.area;
    var qa = r.vazaoArea / 60, c = constantes(e.produto, qa);
    var hcon3 = r.hCone / 3;
    r.pressao = perdaTotal(c, qa, e.H + hcon3);
    r.potencia = r.vazao * r.pressao / (4500 * e.eficiencia / 100);
    r.motor = motorComercial(r.potencia);

    /* Tabela por % de enchimento (aba "Resultados") */
    var KK = e.H / 10, KK2 = (r.volCil * 100 / 10) / r.volTotal;
    r.tabela = [];
    var h = hcon3, pct = r.volCone * 100 / r.volTotal;
    for (var i = 0; i < 11; i++) {
      if (i > 0) { h += KK; pct += KK2; }
      var q = calcVaz(r.area, h, r.potencia, c, e.eficiencia, e.fCompact, e.fSeg);
      var qa2 = q / (r.area * 60), c2 = constantes(e.produto, qa2);
      r.tabela.push({
        pct: pct, altura: h, vazao: q,
        qEsp: q / (r.capacidade * pct / 100),
        pressao: perdaTotal(c2, qa2, h)
      });
    }
    return r;
  }

  var api = { PRODUTOS: PRODUTOS, MOTORES: MOTORES, calcular: calcular };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SiloCalc = api;
})(typeof window !== 'undefined' ? window : this);
