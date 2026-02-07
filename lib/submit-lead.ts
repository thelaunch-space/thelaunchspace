interface LeadPayload {
  project_description: string;
  email: string | null;
  whatsapp_number: string | null;
  prefer_whatsapp: boolean;
}

interface SubmitResponse {
  success: boolean;
  error?: string;
}

export async function submitLead(payload: LeadPayload): Promise<SubmitResponse> {
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed: ${response.status} ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
