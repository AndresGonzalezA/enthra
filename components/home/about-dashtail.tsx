import icon1 from "@/public/images/landing-page/icon-1.png"
import icon2 from "@/public/images/landing-page/icon-2.png"
import icon3 from "@/public/images/landing-page/icon-3.png"
import icon4 from "@/public/images/landing-page/icon-4.png"
import icon5 from "@/public/images/landing-page/icon-5.png"
import icon6 from "@/public/images/landing-page/icon-6.png"
import icon7 from "@/public/images/landing-page/icon-7.png"
import icon8 from "@/public/images/landing-page/icon-8.png"
import icon9 from "@/public/images/landing-page/icon-9.png"
import icon10 from "@/public/images/landing-page/icon-10.png"
import icon11 from "@/public/images/landing-page/icon-11.png"
import icon12 from "@/public/images/landing-page/icon-12.png"
import Image from "next/image"

const AboutEnthra = () => {
  const data = [
    {
      id: 1,
      title: "Diseño centrado en el usuario",
      desc: "Interfaces intuitivas que hacen que los usuarios entiendan fácilmente sus datos en tiempo real.",
      icon: icon1
    },
    {
      id: 2,
      title: "Eficiencia para ingenieros",
      desc: "Pensado para desarrolladores e ingenieros: limpio, modular y fácil de mantener.",
      icon: icon2
    },
    {
      id: 3,
      title: "Tecnología moderna",
      desc: "Usamos las últimas herramientas en IoT, web y conectividad para soluciones seguras y escalables.",
      icon: icon3
    },
    {
      id: 4,
      title: "Componentes reutilizables",
      desc: "Una base sólida que nos permite construir rápido sin sacrificar calidad ni personalización.",
      icon: icon4
    },
    {
      id: 5,
      title: "Versatilidad de aplicación",
      desc: "Desde energía solar hasta salud, adaptamos cada solución a la industria y su operación real.",
      icon: icon5
    },
    {
      id: 6,
      title: "Identidad visual coherente",
      desc: "Colores, formas y flujos que refuerzan tu marca en cada punto de contacto con el sistema.",
      icon: icon6
    },
    {
      id: 7,
      title: "Arranque rápido",
      desc: "Podemos desplegar una primera versión funcional de tu sistema en días, no semanas.",
      icon: icon7
    },
    {
      id: 8,
      title: "Totalmente personalizable",
      desc: "Cada solución es tuya: visualmente, técnicamente y funcionalmente.",
      icon: icon8
    },
    {
      id: 9,
      title: "Rentabilidad comprobada",
      desc: "Automatiza, controla y mejora tus procesos sin inflar tus costos operativos.",
      icon: icon9
    },
    {
      id: 10,
      title: "Documentación clara",
      desc: "Cada proyecto incluye documentación visual y técnica para facilitar su operación o expansión.",
      icon: icon10
    },
    {
      id: 11,
      title: "Mejoras constantes",
      desc: "Tus sistemas evolucionan con tus necesidades. Seguimiento, mejora y actualización continua.",
      icon: icon11
    },
    {
      id: 12,
      title: "Soporte con criterio",
      desc: "Técnicos e ingenieros que entienden tu operación, no solo un call center.",
      icon: icon12
    }
  ]

  return (
    <section id="about-dashtail" className="py-16 2xl:py-[120px]">
      <div className="container">
        <div className="max-w-[670px] mx-auto">
          <h2 className="text-center text-xl xl:text-3xl xl:leading-[46px] font-semibold text-default-900 mb-3">
            ¿Por qué elegir <span className="text-primary">Enthra</span>?
          </h2>
          <p className="text-base xl:leading-7 text-center text-default-700 ">
            Creamos soluciones IoT personalizadas, robustas y listas para escalar, diseñadas para integrarse perfectamente con tus procesos y ofrecer visibilidad total de tu operación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16 mt-[90px]">
          {data.map((item, index) => (
            <div
              key={`about-enthra-${index}`}
              className="relative text-center border border-dotted border-default-300 rounded-sm py-6 pb-8 px-6 hover:border-primary hover:border-solid"
            >
              <div className="w-[72px] h-[72px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Image src={item.icon} alt={item.title} className="w-full h-full object-cover" priority={true} />
              </div>
              <div>
                <h3 className="text-base xl:text-xl font-semibold text-default-600 mb-3 pt-6">
                  {item.title}
                </h3>
                <p className="text-sm xl:text-base text-default-700">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutEnthra
