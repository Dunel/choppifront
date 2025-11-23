export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <header className="w-full border-b border-zinc-100 bg-primary py-4 px-8 flex items-center justify-between">
        <span className="text-xl font-bold text-white tracking-tight">Choppi</span>
        <nav className="flex gap-6">
          <a href="/" className="text-white font-medium hover:underline transition">Inicio</a>
          <a href="/stores" className="text-white font-medium hover:underline transition">Tiendas</a>
          <a href="/login" className="text-white font-medium hover:underline transition">Login</a>
        </nav>
      </header>
      <main className="flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center mx-auto px-6 py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Bienvenido a Choppi
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            Choppi es una plataforma para administrar tiendas, productos e inventario de manera sencilla y eficiente. Explora las tiendas disponibles, cotiza productos y gestiona tu inventario con facilidad. ¡Todo con el estilo característico de Choppi!
          </p>
          <a
            href="/stores"
            className="mt-2 inline-block rounded-xl border border-primary/30 bg-white px-5 py-3 text-base font-semibold text-primary shadow-sm transition hover:bg-primary/10"
          >
            Ir a listado de tiendas
          </a>
        </div>
      </main>
    </div>
  );
}
