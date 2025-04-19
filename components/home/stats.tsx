"use client"

import { cn } from "@/lib/utils"
import { Application, Authentication, ChartBar, Components, DashBoard, Map } from "@/components/svg"

const Stats = () => {
  const data = [
    {
      text: "2 plataformas IoT operativas",
      color: "bg-[#FFE5C2]",
      icon: Components,
    },
    {
      text: "10M+ datos transmitidos",
      color: "bg-[#FFD89B]",
      icon: DashBoard,
    },
    {
      text: "30+ dispositivos conectados",
      color: "bg-[#FFEFA2]",
      icon: Application,
    },
    {
      text: "4 industrias atendidas",
      color: "bg-[#C7F5D6]",
      icon: Authentication,
    },
    {
      text: "Soluciones a la medida",
      color: "bg-[#FFE5AE]",
      icon: ChartBar,
    },
    {
      text: "Listos para escalar",
      color: "bg-[#FCE4EC]",
      icon: Map,
    },
  ]

  return (
    <section id="stats" className="container mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(({ text, icon: Icon, color }, index) => (
          <div
            key={index}
            className={cn(
              "relative p-6 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]",
              color
            )}
          >
            <div className="w-11 h-11 bg-white rounded-full shadow-md grid place-content-center mb-4">
              <Icon className="w-5 h-5 text-[#F79E00]" />
            </div>
            <p className="text-base md:text-lg font-semibold text-[#0F1A2D] leading-snug">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
