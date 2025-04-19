"use client"
import { Icon } from "@iconify/react"
import Image from "next/image"
import label1 from "@/public/images/landing-page/auth-label-1.png"
import label2 from "@/public/images/landing-page/author-label-2.png"
import label3 from "@/public/images/landing-page/label-3.png"
import label4 from "@/public/images/landing-page/label-4.png"
import label5 from "@/public/images/landing-page/label-5.png"
import featured from "@/public/images/landing-page/featured.png"
import { cn } from "@/lib/utils"

const AboutUs = () => {
  const data = [
    { title: "Confiabilidad garantizada", image: label1 },
    { title: "Top en innovación", image: label2 },
    { title: "Reconocimiento industrial", image: label3 },
    { title: "Presencia sólida", image: label4 },
    { title: "Pioneros en IoT", image: label5 },
  ]

  return (
    <section id="about-us" className="bg-white dark:bg-default-950 pt-16 2xl:pt-[120px]">
      <div className="max-w-[670px] mx-auto px-3">
        <h2 className="text-center text-xl xl:text-3xl xl:leading-[46px] font-semibold text-default-900 mb-3">
          Impulsamos el futuro con <span className="text-primary">tecnología IoT</span>
        </h2>
        <p className="text-base xl:leading-7 text-center text-default-700">
          En Enthra diseñamos soluciones inteligentes que conectan, transforman y potencian procesos reales en tiempo real. Tecnología robusta, accesible y personalizada para cada industria.
        </p>
      </div>

      <div className="mt-12 flex justify-center items-center gap-3 lg:gap-16 px-3">
        {data.map((item, index) => (
          <div key={`label-image-${index}`} className="flex flex-col items-center text-center">
            <div className={cn("w-8 h-10 md:w-fit md:h-fit", {
              "w-10 h-14 md:w-fit md:h-fit": index === 2
            })}>
              <Image src={item.image} alt="image" priority={true} />
            </div>
            <p className="text-xs lg:text-base font-medium text-default-700 mt-1 lg:mt-4">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-9 text-center">
        <div className="bg-background border border-primary py-5 px-6 rounded">
          <span className="block text-lg xl:text-2xl font-semibold text-default-900">5 años</span>
          <span className="block mt-1 text-sm font-medium text-default-800 whitespace-nowrap">Impulsando soluciones IoT</span>
        </div>
        <div className="bg-background border border-primary py-5 px-6 rounded">
          <span className="block text-lg xl:text-2xl font-semibold text-default-900">+30</span>
          <span className="block mt-1 text-sm font-medium text-default-800 whitespace-nowrap">Dispositivos conectados</span>
        </div>
        <div className="bg-background border border-primary py-5 px-6 rounded">
          <span className="block text-lg xl:text-2xl font-semibold text-default-900">+10</span>
          <span className="block mt-1 text-sm font-medium text-default-800 whitespace-nowrap">Empresas impactadas</span>
        </div>
        <div className="bg-background border border-primary py-5 px-6 rounded">
          <span className="block text-lg xl:text-2xl font-semibold text-default-900">Escalable</span>
          <span className="block mt-1 text-sm font-medium text-default-800 whitespace-nowrap">Tecnología lista para crecer</span>
        </div>
      </div>


      <div className="h-fit w-full mt-14 max-h-[150px] overflow-hidden">
        <Image
          src={featured}
          alt="featured"
          className="w-full h-auto object-cover"
          priority={true}
        />
</div>
    </section>
  )
}

export default AboutUs
