import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // 1. Criar usuário
  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "Usuário não foi criado" }, { status: 500 });
  }

  // 2. Criar profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    name: name,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user });
}