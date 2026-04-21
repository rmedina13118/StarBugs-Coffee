"use client"

import { FormEvent, useState } from "react";

export default function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Datos de acceso:", { email, password });
  };

  return (
  <div className="flex">

    <div className="relative h-screen w-1/2 bg-[url('/coffe.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 items-center bg-black/30 flex justify-center max-w-md text-center">
        <div>
          <h1 className="text-6xl text-white font-extrabold tracking-tight mb-4">
            StarBugs
            <br />
            <span className="text-emerald-900">Coffee</span>
          </h1>
          <p className="text-sm text-yellow-500">
            PREMIUM COFEE ADMINISTRATION
          </p>
        </div>
      </div>
    </div>


    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 border border-slate-100">
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-800">Bienvenido de nuevo</h2>
          <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder al panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="nombre@restaurante.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>
            <a href="#" className="text-yellow-600 hover:underline font-sm">¿Olvidaste tu contraseña?</a>

          </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <label className="flex items-center text-slate-600 text-sm cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-slate-300 focus:ring-green-500 peer-checked:bg-green-900" />
              Mantener sesión iniciada
            </label>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg shadow--200 transition-all active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  </div>
  )
}