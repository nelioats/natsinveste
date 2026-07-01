import { useState, useEffect } from "react";
import "./App.css";
import LogoNats from "./Logo";

export default function TaxasEconomicas() {
  const [selic, setSelic] = useState(null);
  const [cdi, setCdi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //================================
  // RECEBENDO VALORES
  //================================

  const [tipoInvestimento, setTipoInvestimento] = useState("");

  const [valorInvestido, setValorInvestido] = useState("");
  const [percentualCdi, setPercentualCdi] = useState("");
  const [tipoprazo, setTipoPrazo] = useState("");
  const [qntprazo, setQntPrazo] = useState("");

  const [resultado, setResultado] = useState("");

  //================================
  // FORMATAR VALOR INVESTIDO DEVIDO MASCARA APLICADA NO CAMPO
  //================================

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, "");

    return (Number(numero) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e) => {
    setValorInvestido(formatarMoeda(e.target.value));
  };

  //================================
  // DESCONTO DE IOF
  //================================
  //=========================================
  // Retorna o percentual de IOF conforme
  // a quantidade de dias corridos
  //=========================================
  function obterAliquotaIOF(dias) {
    const tabelaIOF = {
      1: 96,
      2: 93,
      3: 90,
      4: 86,
      5: 83,
      6: 80,
      7: 76,
      8: 73,
      9: 70,
      10: 66,
      11: 63,
      12: 60,
      13: 56,
      14: 53,
      15: 50,
      16: 46,
      17: 43,
      18: 40,
      19: 36,
      20: 33,
      21: 30,
      22: 26,
      23: 23,
      24: 20,
      25: 16,
      26: 13,
      27: 10,
      28: 6,
      29: 3,
    };

    if (dias >= 30) return 0;

    return tabelaIOF[dias] || 0;
  }
  //================================
  // DESCONTO DE IMPOSTO DE RENDA
  //================================
  //=========================================
  // Retorna a alíquota do Imposto de Renda
  //=========================================
  function obterAliquotaIR(dias) {
    if (dias <= 180) return 22.5;

    if (dias <= 360) return 20;

    if (dias <= 720) return 17.5;

    return 15;
  }

  //================================
  // CALCULANDO RENDIMENTO
  //================================

  function calcularInvestimento() {
    //=========================================
    // Converte o valor digitado (1.000,50 -> 1000.50)
    //=========================================
    const valor = Number(valorInvestido.replace(/\./g, "").replace(",", "."));

    //=========================================
    // Verifica se os campos obrigatórios foram preenchidos
    //=========================================
    if (!valor || !cdi || !percentualCdi || !qntprazo || !tipoprazo) {
      alert("Preencha todos os campos.");
      return;
    }

    //=========================================
    // Converte o prazo para meses
    // Se o usuário escolher anos, multiplica por 12
    //=========================================
    const meses =
      tipoprazo === "ano" ? Number(qntprazo) * 12 : Number(qntprazo);

    //=========================================
    // Define as regras do investimento
    //=========================================

    let cobrarIOF = true;
    let cobrarIR = true;

    // LCI e LCA são isentas de IOF e IR
    // e possuem carência mínima de 9 meses
    if (tipoInvestimento === "LCI" || tipoInvestimento === "LCA") {
      cobrarIOF = false;
      cobrarIR = false;
    }

    //=========================================
    // Converte meses para dias úteis
    // Mercado financeiro considera aproximadamente
    // 252 dias úteis por ano (21 por mês)
    //=========================================
    const diasUteis = meses * 21;

    //=========================================
    // Converte o CDI anual (%) para decimal
    // Ex.: 14.15 -> 0.1415
    //=========================================
    const cdiAnual = Number(cdi) / 100;

    //=========================================
    // Calcula o fator diário do CDI
    // Fórmula:
    // (1 + CDI anual)^(1/252)
    //=========================================
    const fatorDiarioCDI = Math.pow(1 + cdiAnual, 1 / 252);

    //=========================================
    // Calcula o fator diário do investimento
    // considerando o percentual do CDI informado
    // Ex.: 104% CDI
    //=========================================
    const fatorDiarioInvestimento =
      1 + (fatorDiarioCDI - 1) * (Number(percentualCdi) / 100);

    //=========================================
    // Calcula o valor final utilizando juros compostos
    //=========================================
    const montante = valor * Math.pow(fatorDiarioInvestimento, diasUteis);

    //=========================================
    // Calcula somente o rendimento obtido
    //=========================================
    const rendimento = montante - valor;

    // ======================================= APLICAR DESCONTOS E IMPOSTOS
    //=========================================
    // Converte meses para dias corridos
    // Utilizado apenas para IOF e IR
    //=========================================
    const diasCorridos = meses * 30;

    //=========================================
    // Calcula a alíquota do IOF
    //=========================================
    const aliquotaIOF = cobrarIOF ? obterAliquotaIOF(diasCorridos) : 0;

    //=========================================
    // Calcula o IOF somente quando houver incidência
    //=========================================

    const iof = cobrarIOF ? rendimento * (aliquotaIOF / 100) : 0;

    //=========================================
    // Rendimento após descontar o IOF
    //=========================================
    const rendimentoAposIOF = rendimento - iof;

    //=========================================
    // Calcula a alíquota do Imposto de Renda
    //=========================================
    const aliquotaIR = cobrarIR ? obterAliquotaIR(diasCorridos) : 0;

    //=========================================
    // Calcula o Imposto de Renda somente quando houver incidência
    //=========================================

    const impostoRenda = cobrarIR ? rendimentoAposIOF * (aliquotaIR / 100) : 0;

    //=========================================
    // Calcula o rendimento líquido
    //=========================================
    const rendimentoLiquido = rendimentoAposIOF - impostoRenda;

    //=========================================
    // Calcula o valor líquido do investimento
    //=========================================
    const montanteLiquido = valor + rendimentoLiquido;
    // ======================================= FIM APLICAR DESCONTOS E IMPOSTOS

    //=========================================
    // Armazena os resultados
    //=========================================
    setResultado({
      tipoInvestimento,

      valorInvestido: valor,

      rendimentoBruto: rendimento,

      diasCorridos,

      diasUteis,

      aliquotaIOF,

      iof,

      aliquotaIR,

      impostoRenda,

      rendimentoLiquido,

      montanteBruto: montante,

      montanteLiquido,

      cobrarIOF,

      cobrarIR,
    });

    //=========================================
    // Exibe informações para conferência
    //=========================================
    console.log("CDI:", cdi);
    console.log("% CDI:", percentualCdi);
    console.log("Prazo (meses):", meses);
    console.log("Dias úteis:", diasUteis);
    console.log("Fator Diário CDI:", fatorDiarioCDI);
    console.log("Fator Diário Investimento:", fatorDiarioInvestimento);
    console.log("Valor Investido:", valor);
    console.log("Rendimento:", rendimento);
    console.log("Montante:", montante);
  }

  //================================
  // CARREGANDO TAXAS CDI E SELIC
  //================================

  useEffect(() => {
    async function fetchTaxas() {
      try {
        setLoading(true);

        // 1. Requisição para Selic Anualizada (Meta definida pelo COPOM)
        const resSelic = await fetch("https://brasilapi.com.br/api/taxas/v1");
        const dataSelic = await resSelic.json();

        // 2. Requisição para CDI Diário
        const resCdi = await fetch("https://brasilapi.com.br/api/taxas/v1");
        const dataCdi = await resCdi.json();

        // Salva a Selic (que já vem expressa em formato anualizado pela API)
        if (dataSelic.length > 0) {
          setSelic(parseFloat(dataSelic[0].valor).toFixed(2));
        }

        // Converte a taxa diária do CDI para o equivalente anualizado (Base 252 dias úteis)
        if (dataCdi.length > 0) {
          setCdi(parseFloat(dataCdi[1].valor).toFixed(2));
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do Banco Central:", err);
        setError("Não foi possível carregar as taxas atuais.");
        setLoading(false);
      }
    }

    fetchTaxas();
  }, []);

  if (loading) return <p>Carregando taxas do Banco Central...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <div className="calculator-card">
        <header className="app-header">
          <LogoNats /> {/* Chame o componente da logo aqui */}
        </header>

        {/* Painel de Taxas de Referência */}
        <div className="rates-grid">
          <div className="rate-badge">
            <span>Taxa Selic</span>
            <strong>{selic}% a.a.</strong>
          </div>
          <div className="rate-badge">
            <span>Taxa CDI</span>
            <strong>{cdi}% a.a.</strong>
          </div>
        </div>

        {/* Formulário de Simulação */}
        <div className="form-group">
          <label>Tipo de Investimento</label>
          <select
            className="select-field"
            value={tipoInvestimento}
            onChange={(e) => setTipoInvestimento(e.target.value)}
          >
            <option value="">Selecione o produto</option>
            <option value="CDB">CDB</option>
            <option value="LCI">LCI</option>
            <option value="LCA">LCA</option>
          </select>
        </div>

        <div className="form-group">
          <label>Valor a Investir (R$)</label>
          <input
            className="input-field"
            type="text"
            value={valorInvestido}
            onChange={handleChange}
            placeholder="0,00"
            inputMode="numeric"
          />
        </div>

        <div className="form-group">
          <label>Rentabilidade (% do CDI)</label>
          <input
            className="input-field"
            type="number"
            value={percentualCdi}
            onChange={(e) => setPercentualCdi(e.target.value)}
            placeholder="Ex: 100"
          />
        </div>

        <div className="row-group">
          <div className="form-group">
            <label>Prazo</label>
            <input
              className="input-field"
              type="number"
              value={qntprazo}
              onChange={(e) => setQntPrazo(e.target.value)}
              placeholder="Ex: 12"
            />
          </div>
          <div className="form-group">
            <label>Período</label>
            <select
              className="select-field"
              value={tipoprazo}
              onChange={(e) => setTipoPrazo(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="meses">Meses</option>
              <option value="ano">Anos</option>
            </select>
          </div>
        </div>

        <button className="btn-calculate" onClick={calcularInvestimento}>
          Simular Rendimento
        </button>

        {/* Apresentação dos Resultados Simulados */}
        {resultado && (
          <div className="results-container">
            <h3 className="results-title">Resultado da Simulação</h3>

            <div className="result-row">
              <span className="label">Valor Inicial</span>
              <span className="value">
                {resultado.valorInvestido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="result-row">
              <span className="label">Rendimento Bruto</span>
              <span className="value">
                {resultado.rendimentoBruto.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="result-row">
              <span className="label">
                Desconto de IOF ({resultado.aliquotaIOF}%)
              </span>
              <span className="value">
                {resultado.iof.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="result-row">
              <span className="label">
                Imposto de Renda ({resultado.aliquotaIR}%)
              </span>
              <span className="value">
                {resultado.impostoRenda.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="result-row">
              <span className="label">Rendimento Líquido</span>
              <span className="value">
                {resultado.rendimentoLiquido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="result-row total">
              <span className="label">Valor Total Líquido</span>
              <span className="value">
                {resultado.montanteLiquido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// git add .
// git commit -m "ajuste: melhoria no layout"
// git push origin main



// npm run deploy