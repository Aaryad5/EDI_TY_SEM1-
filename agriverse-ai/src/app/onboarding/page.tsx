"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper, ScanLine, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { submitFarmData } from "@/lib/services/submitFarmData";
import { generateRecommendations } from "@/lib/services/recommendationService";
import { farmService } from "@/lib/services/farmService";
import { snapshotService } from "@/lib/services/snapshotService";
import { FarmLocationForm, type FarmLocationValues } from "@/components/forms/farm-location-form";
import { WeatherForm, type WeatherValues } from "@/components/forms/weather-form";
import { SoilForm, type SoilValues } from "@/components/forms/soil-form";
import { CropForm, type CropValues } from "@/components/forms/crop-form";
import { IrrigationForm, type IrrigationValues } from "@/components/forms/irrigation-form";
import { FarmManagementForm, type ManagementValues } from "@/components/forms/farm-management-form";
import { FarmerPreferencesForm, type PreferencesValues } from "@/components/forms/farmer-preferences-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { WeatherRecord, SoilRecord, CropRecord, IrrigationRecord } from "@/lib/types";

const STEPS = [
  { title: "Farm Location", description: "Where is your farm?" },
  { title: "Weather", description: "Local climate" },
  { title: "Soil", description: "Soil conditions" },
  { title: "Crop + Irrigation", description: "What & how" },
  { title: "Management", description: "Your setup" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, addFarm } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [tab3, setTab3] = React.useState("crop");
  const [tab4, setTab4] = React.useState("management");

  const [location, setLocation] = React.useState<FarmLocationValues>({
    name: "",
    country: "India",
    state: "",
    district: "",
    village: "",
    latitude: 18.5204,
    longitude: 73.8567,
    areaValue: 5,
    areaUnit: "acres",
  });
  const [weather, setWeather] = React.useState<WeatherValues | null>(null);
  const [soil, setSoil] = React.useState<SoilValues | null>(null);
  const [crop, setCrop] = React.useState<CropValues | null>(null);
  const [irrigation, setIrrigation] = React.useState<IrrigationValues | null>(null);
  const [management, setManagement] = React.useState<ManagementValues | null>(null);
  const [preferences, setPreferences] = React.useState<PreferencesValues | null>(null);
  const mgmtRef = React.useRef<ManagementValues | null>(null);
  const prefsRef = React.useRef<PreferencesValues | null>(null);
  const subReady = React.useRef(false);

  const submitForm = (id: string) => {
    const el = document.getElementById(id) as HTMLFormElement | null;
    el?.requestSubmit();
  };

  const handleFinish = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Not signed in", description: "Create an account before completing onboarding." });
      router.push("/signup");
      return;
    }
    // Ensure both management and preferences forms have submitted.
    if (!mgmtRef.current) {
      submitForm("onboard-management");
      submitForm("onboard-preferences");
    }
    if (!subReady.current) {
      subReady.current = true;
      // give React a tick to flush onSubmit handlers into refs
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const managementFinal = management ?? mgmtRef.current;
    const preferencesFinal = preferences ?? prefsRef.current;
    if (!managementFinal || !preferencesFinal) {
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      const farm = await farmService.createFarm(user.id, {
        name: location.name,
        country: location.country,
        state: location.state || location.country,
        district: location.district,
        village: location.village || "",
        latitude: location.latitude,
        longitude: location.longitude,
        areaValue: location.areaValue,
        areaUnit: location.areaUnit,
        boundary: { type: "Polygon", coordinates: location.boundary ?? [] },
      });
      addFarm(farm);

      const changes = [
        "Farm created",
        weather ? "Weather recorded" : null,
        soil ? "Soil sampled" : null,
        crop ? "Crop registered" : null,
        irrigation ? "Irrigation configured" : null,
        managementFinal ? "Farm management saved" : null,
        preferencesFinal ? "Farmer preferences saved" : null,
      ].filter(Boolean) as string[];

      await submitFarmData(user.id, farm.id, {
        weather: (weather ?? undefined) as WeatherRecord | undefined,
        soil: (soil ?? undefined) as SoilRecord | undefined,
        crop: (crop ?? undefined) as CropRecord | undefined,
        irrigation: (irrigation ?? undefined) as IrrigationRecord | undefined,
        management: managementFinal ?? undefined,
        preferences: preferencesFinal ?? undefined,
        changes,
        label: "Farmer onboarding",
        title: "Onboarding Complete",
      });

      const latest = await snapshotService.getLatestSnapshot(farm.id);
      if (latest) await generateRecommendations(user.id, latest);

      setDone(true);
      toast({ variant: "success", title: "Farm registered", description: "Your farm profile, snapshot and history record were created." });
      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err) {
      toast({ variant: "destructive", title: "Could not complete onboarding", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-lightgreen/20">
      <header className="flex items-center justify-between border-b border-agri/10 bg-white/70 px-6 py-4 backdrop-blur">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-dark/60">
          <ScanLine className="h-4 w-4 text-agri" />
          {done ? "Complete" : `Step ${Math.min(step + 1, STEPS.length)} of ${STEPS.length}`}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-agri/10 bg-white px-6 py-16 text-center shadow-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-brand text-white">
                <PartyPopper className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark">Your farm is ready!</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-dark/60">
                  AgriVerse AI created your farm profile and generated its first AI recommendations.
                  Redirecting to your dashboard…
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-fresh" />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl">
                  {step === 0 ? "Let's understand your farm" : STEPS[step]!.title}
                </h1>
                <p className="mt-1 text-sm text-dark/55">
                  {step === 0
                    ? "Tell us about your farm location first. You can edit anything later."
                    : STEPS[step]!.description}
                </p>
              </div>

              <Stepper steps={STEPS} current={step} className="mb-8" />

              <div className="rounded-2xl border border-agri/10 bg-white p-5 shadow-sm sm:p-8">
                {step === 0 && (
                  <FarmLocationForm
                    formId="onboard-location"
                    initial={location}
                    showSubmit={false}
                    onSubmit={(v) => {
                      setLocation(v);
                      setStep(1);
                    }}
                    footer={
                      <WizardNav
                        canNext={!!location.name && !!location.district}
                        backLabel="Cancel"
                        onBack={() => router.push("/")}
                        onNext={() => submitForm("onboard-location")}
                      />
                    }
                  />
                )}
                {step === 1 && (
                  <WeatherForm
                    formId="onboard-weather"
                    initial={weather ?? undefined}
                    showSubmit={false}
                    onSubmit={(v) => {
                      setWeather(v);
                      setStep(2);
                    }}
                    footer={
                      <WizardNav
                        canNext={!!weather}
                        onBack={() => setStep(0)}
                        onNext={() => submitForm("onboard-weather")}
                      />
                    }
                  />
                )}
                {step === 2 && (
                  <SoilForm
                    formId="onboard-soil"
                    initial={soil ?? undefined}
                    showSubmit={false}
                    onSubmit={(v) => {
                      setSoil(v);
                      setStep(3);
                    }}
                    footer={
                      <WizardNav
                        canNext={!!soil}
                        onBack={() => setStep(1)}
                        onNext={() => submitForm("onboard-soil")}
                      />
                    }
                  />
                )}
                {step === 3 && (
                  <div className="space-y-5">
                    <Tabs value={tab3} onValueChange={setTab3}>
                      <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="crop">Crop details {crop ? "✓" : ""}</TabsTrigger>
                        <TabsTrigger value="irrigation">Irrigation {irrigation ? "✓" : ""}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="crop">
                        <CropForm
                          formId="onboard-crop"
                          initial={crop ?? undefined}
                          showSubmit={false}
                          onSubmit={(v) => {
                            setCrop(v);
                            if (!irrigation) {
                              setTab3("irrigation");
                            } else {
                              setStep(4);
                            }
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="irrigation">
                        <IrrigationForm
                          formId="onboard-irrigation"
                          initial={irrigation ?? undefined}
                          showSubmit={false}
                          onSubmit={(v) => {
                            setIrrigation(v);
                            if (crop) {
                              setStep(4);
                            } else {
                              setTab3("crop");
                            }
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                    <WizardNav
                      canNext={true}
                      onBack={() => setStep(2)}
                      onNext={() => submitForm(tab3 === "crop" ? "onboard-crop" : "onboard-irrigation")}
                      nextLabel={tab3 === "crop" && !crop ? "Save Crop & Go to Irrigation" : "Save & Continue"}
                    />
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-5">
                    <Tabs value={tab4} onValueChange={setTab4}>
                      <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="management">Farm management {management ? "✓" : ""}</TabsTrigger>
                        <TabsTrigger value="preferences">Your preferences {preferences ? "✓" : ""}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="management">
                        <FarmManagementForm
                          formId="onboard-management"
                          initial={management ?? undefined}
                          showSubmit={false}
                          onSubmit={(v) => {
                            setManagement(v);
                            mgmtRef.current = v;
                            if (!preferences) {
                              setTab4("preferences");
                            }
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="preferences">
                        <FarmerPreferencesForm
                          formId="onboard-preferences"
                          initial={preferences ?? undefined}
                          showSubmit={false}
                          onSubmit={(v) => {
                            setPreferences(v);
                            prefsRef.current = v;
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                    <WizardNav
                      canNext={true}
                      onBack={() => setStep(3)}
                      finishing={submitting}
                      final
                      onNext={() => submitForm(tab4 === "management" ? "onboard-management" : "onboard-preferences")}
                      onFinish={handleFinish}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  onFinish,
  canNext,
  backLabel = "Back",
  nextLabel = "Continue",
  finishing = false,
  final = false,
}: {
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  canNext: boolean;
  backLabel?: string;
  nextLabel?: string;
  finishing?: boolean;
  final?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-4">
      <Button type="button" variant="outline" onClick={onBack} disabled={!onBack}>
        <ArrowLeft className="mr-1 h-4 w-4" /> {backLabel}
      </Button>
      {final ? (
        <Button
          type="button"
          className={cn("gap-2", finishing && "cursor-wait")}
          disabled={!canNext || finishing}
          onClick={onFinish}
        >
          {finishing && <Loader2 className="h-4 w-4 animate-spin" />}
          {finishing ? "Completing…" : "Complete Setup"}
          {!finishing && <Check className="ml-1 h-4 w-4" />}
        </Button>
      ) : (
        <Button type="button" disabled={!canNext} onClick={onNext}>
          {nextLabel} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}