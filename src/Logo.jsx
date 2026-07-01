export default function LogoNats() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 410 100" /* Ajustado o box para eliminar sobras laterais */
      width="100%"
      style={{ maxWidth: "550px", display: "block", margin: "0 auto" }}
    >
      <defs>
        <linearGradient id="natsModernGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* ÍCONE: Centralizado puxando um pouco mais para a esquerda */}
      <g transform="translate(5, 15)">
        <rect x="15" y="62" width="50" height="6" rx="3" fill="#e2e8f0" />
        <rect
          x="20"
          y="28"
          width="10"
          height="40"
          rx="5"
          fill="url(#natsModernGrad)"
        />
        <path
          d="M 30 28 L 50 68 L 60 68 L 30 28 Z"
          fill="url(#natsModernGrad)"
          opacity="0.85"
        />
        <rect
          x="50"
          y="12"
          width="10"
          height="56"
          rx="5"
          fill="url(#natsModernGrad)"
        />
        <circle cx="55" cy="4" r="4" fill="#10b981" />
      </g>

      {/* TIPOGRAFIA: Ajustada a posição X para colar perfeitamente ao lado do ícone */}
      <g transform="translate(85, 15)">
        <text
          x="0"
          y="40"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="32"
          fontWeight="700"
          fill="#1e293b"
          letterSpacing="-0.5"
        >
          Nats
          <tspan fill="#059669" fontWeight="400">
            Investe
          </tspan>
        </text>

        <text
          x="1"
          y="60"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill="#94a3b8"
          letterSpacing="4"
        >
          RENDA FIXA SOB MEDIDA
        </text>
      </g>
    </svg>
  );
}
