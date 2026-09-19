const VALID_CODES: Record<string, number> = {
  SAVE20: 20,
  WELCOME10: 10,
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code : "";

  const percentOff = VALID_CODES[code.toUpperCase()];
  if (percentOff === undefined) {
    return Response.json({ valid: false }, { status: 200 });
  }

  return Response.json({ valid: true, percentOff }, { status: 200 });
}
