"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  objective: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  objective: "",
};

const fieldClassName =
  "mt-2 w-full border-b border-porcelain/20 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-mineral/55 focus:border-signal-blue focus:ring-0";

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Informe seu nome com pelo menos 2 caracteres.";
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }

  if (values.company.trim().length < 2) {
    errors.company = "Informe a empresa ou organização.";
  }

  if (!values.projectType) {
    errors.projectType = "Selecione o tipo de desafio.";
  }

  if (!values.timeline) {
    errors.timeline = "Selecione uma janela de início.";
  }

  if (values.objective.trim().length < 30) {
    errors.objective = "Conte um pouco mais — use pelo menos 30 caracteres.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const briefing = useMemo(
    () =>
      [
        "NOVO BRIEFING — VOIDCUBE",
        "",
        `Nome: ${values.name}`,
        `E-mail: ${values.email}`,
        `Empresa: ${values.company}`,
        `Desafio: ${values.projectType}`,
        `Investimento: ${values.budget || "A definir"}`,
        `Janela de início: ${values.timeline}`,
        "",
        "Objetivo / contexto:",
        values.objective,
      ].join("\n"),
    [values],
  );

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  const emailDraftUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `Briefing — ${values.company || "novo projeto"}`,
  )}&body=${encodeURIComponent(briefing)}`;

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPrepared(false);
    setCopyStatus("idle");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPrepared(false);
      requestAnimationFrame(() => {
        const firstInvalid = form.querySelector<HTMLElement>(
          "[aria-invalid='true']",
        );
        firstInvalid?.focus();
      });
      return;
    }

    setPrepared(true);
  }

  async function copyBriefing() {
    try {
      await navigator.clipboard.writeText(briefing);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            Seu nome <span className="text-node-gold">*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClassName}
            placeholder="Como podemos chamar você?"
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-xs text-node-gold">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            E-mail de trabalho <span className="text-node-gold">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClassName}
            placeholder="voce@empresa.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-xs text-node-gold">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="company"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            Empresa <span className="text-node-gold">*</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => updateField("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={fieldClassName}
            placeholder="Nome da organização"
          />
          {errors.company && (
            <p id="company-error" className="mt-2 text-xs text-node-gold">
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="projectType"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            Tipo de desafio <span className="text-node-gold">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={values.projectType}
            onChange={(event) => updateField("projectType", event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "project-type-error" : undefined}
            className={`${fieldClassName} cursor-pointer bg-void`}
          >
            <option value="">Selecione uma frente</option>
            <option value="Plataforma ou infraestrutura digital">
              Plataforma ou infraestrutura digital
            </option>
            <option value="Experiência 3D / WebGL">
              Experiência 3D / WebGL
            </option>
            <option value="Produto digital ponta a ponta">
              Produto digital ponta a ponta
            </option>
            <option value="Diagnóstico técnico e criativo">
              Diagnóstico técnico e criativo
            </option>
          </select>
          {errors.projectType && (
            <p id="project-type-error" className="mt-2 text-xs text-node-gold">
              {errors.projectType}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="budget"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            Faixa de investimento
          </label>
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            className={`${fieldClassName} cursor-pointer bg-void`}
          >
            <option value="">Ainda vamos definir</option>
            <option value="R$ 40 mil — R$ 80 mil">R$ 40 mil — R$ 80 mil</option>
            <option value="R$ 80 mil — R$ 160 mil">R$ 80 mil — R$ 160 mil</option>
            <option value="Acima de R$ 160 mil">Acima de R$ 160 mil</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timeline"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
          >
            Janela de início <span className="text-node-gold">*</span>
          </label>
          <select
            id="timeline"
            name="timeline"
            value={values.timeline}
            onChange={(event) => updateField("timeline", event.target.value)}
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
            className={`${fieldClassName} cursor-pointer bg-void`}
          >
            <option value="">Selecione uma janela</option>
            <option value="Agora / até 30 dias">Agora / até 30 dias</option>
            <option value="Em 1 a 3 meses">Em 1 a 3 meses</option>
            <option value="Em 3 a 6 meses">Em 3 a 6 meses</option>
            <option value="Sem data definida">Sem data definida</option>
          </select>
          {errors.timeline && (
            <p id="timeline-error" className="mt-2 text-xs text-node-gold">
              {errors.timeline}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="objective"
          className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-mineral"
        >
          O que precisa mudar? <span className="text-node-gold">*</span>
        </label>
        <textarea
          id="objective"
          name="objective"
          rows={5}
          value={values.objective}
          onChange={(event) => updateField("objective", event.target.value)}
          aria-invalid={Boolean(errors.objective)}
          aria-describedby={errors.objective ? "objective-error" : "objective-hint"}
          className={`${fieldClassName} resize-y leading-7`}
          placeholder="Descreva o contexto, o obstáculo e como você reconhecerá um bom resultado."
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          {errors.objective ? (
            <p id="objective-error" className="text-xs text-node-gold">
              {errors.objective}
            </p>
          ) : (
            <p id="objective-hint" className="text-xs text-mineral/70">
              Não é preciso ter um escopo fechado.
            </p>
          )}
          <span className="shrink-0 font-sans text-[10px] font-medium tabular-nums text-mineral/70">
            {values.objective.length} caracteres
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-porcelain/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-mineral">
          Este formulário prepara o briefing no seu navegador. Você revisa e
          escolhe como enviá-lo no próximo passo.
        </p>
        <button
          type="submit"
          className="group inline-flex min-h-12 items-center justify-center gap-4 bg-signal-blue px-6 text-sm font-medium uppercase tracking-[0.1em] text-void outline-none transition-colors hover:bg-porcelain focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void"
        >
          Preparar briefing
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div aria-live="polite">
        {prepared && (
          <section className="border border-signal-blue/60 bg-signal-deep/25 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center bg-node-gold text-void">
                <Check aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-lg font-medium">Briefing preparado.</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-mineral">
                  Nenhuma mensagem foi enviada ainda. Abra um rascunho no seu
                  aplicativo de e-mail ou copie o texto para usar no canal que
                  preferir.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={emailDraftUrl}
                className="inline-flex min-h-11 items-center justify-center gap-3 bg-porcelain px-5 text-xs font-medium uppercase tracking-[0.1em] text-void outline-none transition-colors hover:bg-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-basalt"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                Abrir rascunho no e-mail
              </a>
              <button
                type="button"
                onClick={copyBriefing}
                className="inline-flex min-h-11 items-center justify-center gap-3 border border-porcelain/20 px-5 text-xs font-medium uppercase tracking-[0.1em] text-porcelain outline-none transition-colors hover:border-signal-blue hover:text-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue"
              >
                {copyStatus === "copied" ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Copy aria-hidden="true" className="h-4 w-4" />
                )}
                {copyStatus === "copied" ? "Briefing copiado" : "Copiar briefing"}
              </button>
            </div>

            {copyStatus === "error" && (
              <p className="mt-3 text-xs text-node-gold">
                O navegador bloqueou a cópia. Use o botão de e-mail para abrir
                o texto completo.
              </p>
            )}
          </section>
        )}
      </div>
    </form>
  );
}
