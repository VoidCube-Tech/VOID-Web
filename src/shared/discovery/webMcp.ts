/** Declarative WebMCP remains inert in browsers without native support. */
export function formTool(name: string, description: string, enabled = true) {
  return { toolname: enabled ? name : undefined, tooldescription: enabled ? description : undefined };
}
interface AgentSubmitEvent extends Event {
  readonly agentInvoked?: boolean;
  readonly respondWith?: (result: Promise<unknown>) => void;
}
/** Call after preventDefault; return accurate status without exposing personal data. */
export function respondToAgent(event: Event, result: Readonly<Record<string, unknown>>) {
  const agent = event as AgentSubmitEvent;
  if (agent.agentInvoked && typeof agent.respondWith === "function") agent.respondWith(Promise.resolve(result));
}
