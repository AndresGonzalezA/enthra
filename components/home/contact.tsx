"use client"

import { useState } from "react"

const ContactEnthra = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("https://formsubmit.co/ajax/andres.gonzalez@enthra.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", email: "", phone: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }
  

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-[#FFF9F0] via-white to-[#FFF] text-default-900 dark:from-[#1a1a1a] dark:via-[#121212] dark:to-[#121212] dark:text-white">

      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            Conecta tu visión con <span className="text-[#f79e00]">tecnología real</span>
          </h2>
          <p className="text-lg text-default-700 dark:text-default-300 max-w-2xl mx-auto">
            Cuéntanos en qué proceso necesitas visibilidad, automatización o control. Nuestro equipo te responderá muy pronto para ayudarte a llevar tu idea a la realidad.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#121212] border border-default-200 dark:border-default-800 rounded-xl shadow-2xl px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-default-300 dark:border-default-700 rounded-lg px-4 py-3 text-base bg-white dark:bg-default-800 text-default-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-default-300 dark:border-default-700 rounded-lg px-4 py-3 text-base bg-white dark:bg-default-800 text-default-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Número de celular"
            value={form.phone}
            onChange={handleChange}
            required
            className="col-span-full border border-default-300 dark:border-default-700 rounded-lg px-4 py-3 text-base bg-white dark:bg-default-800 text-default-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
          />
          <textarea
            name="message"
            placeholder="¿Qué idea tienes en mente? Cuéntanos qué quieres monitorear, automatizar o controlar."
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            className="col-span-full border border-default-300 dark:border-default-700 rounded-lg px-4 py-3 text-base bg-white dark:bg-default-800 text-default-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
          />
          <button
            type="submit"
            className="col-span-full bg-[#f79e00] hover:bg-[#e38f00] text-white font-semibold py-3 rounded-lg text-lg transition"
          >
            Enviar mensaje
          </button>
          {status === "success" && (
            <p className="col-span-full text-green-600 text-sm mt-2">
              Tu mensaje ha sido enviado con éxito.
            </p>
          )}
          {status === "error" && (
            <p className="col-span-full text-red-600 text-sm mt-2">
              Hubo un error al enviar tu mensaje. Intenta de nuevo.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default ContactEnthra
