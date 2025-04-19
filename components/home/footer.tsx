"use client"
import { SiteLogo } from "@/components/svg";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#0f1a2d] text-white pt-16 pb-8">
      <div className="container max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        <SiteLogo className="w-auto h-[60px] mb-6" />
        <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl text-sm text-white/80 items-start text-left">
          <div>
            <p className="leading-relaxed">
              Desarrollamos soluciones IoT personalizadas para monitoreo, automatización y control de procesos industriales, biomédicos, solares y más. Conectamos tu visión con tecnología real.
            </p>
          </div>
          <div className="flex flex-col gap-2 pl-6 border-l border-white/20">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> info@enthra.co
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +57 312 884 63 99
            </div>
            <span>Ubicación: Medellín, Colombia</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/20 pt-2 text-center text-white/50 text-sm">
        © 2025 Enthra. Todos los derechos reservados.
      </div>

    </footer>
  );
};

export default Footer;
