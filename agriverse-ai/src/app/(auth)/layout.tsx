import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(45,106,79,0.6),transparent_45%)]" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Logo variant="light" />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-snug">
              Smarter Farming.
              <br />
              Better Decisions.
              <br />
              <span className="text-lightgreen">Sustainable Future.</span>
            </h1>
            <p className="max-w-md text-sm text-white/70">
              One platform for weather, soil, crops, irrigation and AI-powered recommendations —
              built for Indian agriculture, ready for the world.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-white/50">
            <span>Weather Agents</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>Soil Intelligence</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>Digital Twin</span>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-cream/40 p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}