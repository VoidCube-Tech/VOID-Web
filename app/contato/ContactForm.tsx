"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  investmentStatus: string;
  timeline: string;
  objective: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  investmentStatus: "",
  timeline: "",
  objective: "",
};

const fieldClassName =
  "mt-2 w-full border-b border-porcelain/20 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-mineral/55 focus:border-spectral-blue focus:ring-0";

const labelClassName = "text-sm font-semibold text-mineral";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

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
    errors.projectType = "Selecione a frente mais próxima do desafio.";
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
        "BRIEFING INICIAL — VOIDCUBE",
        "",
        `Nome: ${values.name}`,
        `E-mail: ${values.email}`,
        `Empresa: ${values.company}`,
        `Frente do desafio: ${values.projectType}`,
        `Situação do investimento: ${values.investmentStatus || "A definir"}`,
        `Janela de início: ${values.timeline}`,
        "",
        "Contexto e mudança esperada:",
        values.objective,
      ].join("\n"),
    [values],
  );

  const emailDraftUrl = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Briefing — ${values.company || "novo projeto"}`,
      )}&body=${encodeURIComponent(briefing)}`
    : "";

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
        form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setPrepared(true);
    setCopyStatus("idle");
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
          <label htmlFor="name" className={labelClassName}>
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
            <p id="name-error" className="mt-2 text-sm text-node-gold">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
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
            <p id="email-error" className="mt-2 text-sm text-node-gold">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="company" className={labelClassName}>
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
            <p id="company-error" className="mt-2 text-sm text-node-gold">
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="projectType" className={labelClassName}>
            Frente do desafio <span className="text-node-gold">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={values.projectType}
            onChange={(event) => updateField("projectType", event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={
              errors.projectType ? "project-type-error" : undefined
            }
            className={`${fieldClassName} cursor-pointer bg-void`}
          >
            <option value="">Selecione a frente mais próxima</option>
            <option value="Produto digital novo ou em evolução">
              Produto digital novo ou em evolução
            </option>
            <option value="Plataforma, API ou integração">
              Plataforma, API ou integração
            </option>
            <option value="Cloud, confiabilidade ou observabilidade">
              Cloud, confiabilidade ou observabilidade
            </option>
            <option value="WebGL, 3D ou visualização">
              WebGL, 3D ou visualização
            </option>
            <option value="Diagnóstico e definição técnica">
              Diagnóstico e definição técnica
            </option>
          </select>
          {errors.projectType && (
            <p id="project-type-error" className="mt-2 text-sm text-node-gold">
              {errors.projectType}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="investmentStatus" className={labelClassName}>
            Situação do investimento
          </label>
          <select
            id="investmentStatus"
            name="investmentStatus"
            value={values.investmentStatus}
            onChange={(event) =>
              updateField("investmentStatus", event.target.value)
            }
            className={`${fieldClassName} cursor-pointer bg-void`}
          >
            <option value="">Ainda não definido</option>
            <option value="Existe uma faixa aprovada">
              Existe uma faixa aprovada
            </option>
            <option value="Está em processo de aprovação">
              Está em processo de aprovação
            </option>
            <option value="Precisa ser estimado em conjunto">
              Precisa ser estimado em conjunto
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className={labelClassName}>
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
            <option value="Agora ou nos próximos 30 dias">
              Agora ou nos próximos 30 dias
            </option>
            <option value="Em 1 a 3 meses">Em 1 a 3 meses</option>
            <option value="Em 3 a 6 meses">Em 3 a 6 meses</option>
            <option value="Sem data definida">Sem data definida</option>
          </select>
          {errors.timeline && (
            <p id="timeline-error" className="mt-2 text-sm text-node-gold">
              {errors.timeline}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="objective" className={labelClassName}>
          O que precisa mudar? <span className="text-node-gold">*</span>
        </label>
        <textarea
          id="objective"
          name="objective"
          rows={6}
          value={values.objective}
          onChange={(event) => updateField("objective", event.target.value)}
          aria-invalid={Boolean(errors.objective)}
          aria-describedby={
            errors.objective ? "objective-error" : "objective-hint"
          }
          className={`${fieldClassName} resize-y leading-7`}
          placeholder="Descreva o contexto, o principal obstáculo e como você reconhecerá um bom resultado."
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          {errors.objective ? (
            <p id="objective-error" className="text-sm text-node-gold">
              {errors.objective}
            </p>
          ) : (
            <p id="objective-hint" className="text-sm text-mineral/75">
              Não é preciso ter um escopo fechado.
            </p>
          )}
          <span className="shrink-0 font-mono text-xs tabular-nums text-mineral/70">
            {values.objective.length} caracteres
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-porcelain/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-6 text-mineral">
          Os dados ficam neste navegador. O próximo passo apenas prepara o texto
          para sua revisão.
        </p>
        <button type="submit" className="button-primary group shrink-0">
          Revisar briefing
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div aria-live="polite">
        {prepared && (
          <section className="border border-signal-blue/55 bg-signal-deep/20 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center bg-node-gold text-void">
                <Check aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Briefing pronto para revisão.</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-mineral">
                  Nenhuma mensagem foi enviada. Revise o conteúdo abaixo e
                  escolha como deseja compartilhá-lo.
                </p>
              </div>
            </div>

            <pre className="mt-6 max-h-80 overflow-auto whitespace-pre-wrap border border-porcelain/12 bg-void/55 p-4 font-mono text-xs leading-6 text-mineral">
              {briefing}
            </pre>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {emailDraftUrl ? (
                <a
                  href={emailDraftUrl}
                  className="inline-flex min-h-11 items-center justify-center gap-3 bg-porcelain px-5 text-sm font-semibold text-void outline-none transition-colors hover:bg-spectral-blue focus-visible:ring-2 focus-visible:ring-spectral-blue focus-visible:ring-offset-2 focus-visible:ring-offset-basalt"
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  Abrir rascunho de e-mail
                </a>
              ) : null}
              <button
                type="button"
                onClick={copyBriefing}
                className="inline-flex min-h-11 items-center justify-center gap-3 border border-porcelain/20 px-5 text-sm font-semibold text-porcelain outline-none transition-colors hover:border-spectral-blue hover:text-spectral-blue focus-visible:ring-2 focus-visible:ring-spectral-blue"
              >
                {copyStatus === "copied" ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Copy aria-hidden="true" className="h-4 w-4" />
                )}
                {copyStatus === "copied" ? "Briefing copiado" : "Copiar briefing"}
              </button>
            </div>

            {!emailDraftUrl ? (
              <p className="mt-4 text-sm leading-6 text-mineral">
                O endereço de contato não está configurado neste ambiente. Use
                a cópia para compartilhar o briefing pelo canal que preferir.
              </p>
            ) : null}

            {copyStatus === "error" && (
              <p className="mt-4 text-sm text-node-gold">
                O navegador bloqueou a cópia automática. O texto permanece
                visível acima para seleção manual.
              </p>
            )}
          </section>
        )}
      </div>
    </form>
  );
}
