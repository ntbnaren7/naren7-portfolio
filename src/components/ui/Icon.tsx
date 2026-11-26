import type { IconType } from "react-icons";
import { RiOpenaiLine } from "react-icons/ri";
import {
  SiClaude,
  SiDart,
  SiEspressif,
  SiFastapi,
  SiFirebase,
  SiFlutter,
  SiGooglegemini,
  SiHuggingface,
  SiLangchain,
  SiLanggraph,
  SiNumpy,
  SiOnnx,
  SiOpencv,
  SiOpenjdk,
  SiPandas,
  SiPydantic,
  SiPytorch,
  SiRazorpay,
  SiScikitlearn,
  SiSqlalchemy,
  SiSqlite,
  SiSupabase,
  SiTensorflow,
  SiUltralytics,
} from "react-icons/si";

const techIcons: Record<string, IconType> = {
  claude: SiClaude,
  dart: SiDart,
  espressif: SiEspressif,
  fastapi: SiFastapi,
  firebase: SiFirebase,
  flutter: SiFlutter,
  gemini: SiGooglegemini,
  "hugging-face": SiHuggingface,
  java: SiOpenjdk,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  numpy: SiNumpy,
  onnx: SiOnnx,
  openai: RiOpenaiLine,
  opencv: SiOpencv,
  pandas: SiPandas,
  pydantic: SiPydantic,
  pytorch: SiPytorch,
  razorpay: SiRazorpay,
  "scikit-learn": SiScikitlearn,
  sqlalchemy: SiSqlalchemy,
  sqlite: SiSqlite,
  supabase: SiSupabase,
  tensorflow: SiTensorflow,
  ultralytics: SiUltralytics,
};

type IconProps = { name: string; size?: number; className?: string };

export function Icon({ name, size = 14, className = "" }: IconProps) {
  const TechIcon = techIcons[name];
  if (TechIcon) {
    return (
      <TechIcon
        size={size}
        className={`icon ${className}`}
        aria-hidden="true"
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
