import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, category, message } = await request.json();

    // Validação
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Enviar email via SendGrid
    await sgMail.send({
      to: 'suporte@posturai.com.br',
      from: 'noreply@posturai.com.br', // Precisa ser verificado no SendGrid
      subject: `[PosturAI] ${category} - ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nCategoria: ${category}\n\nMensagem:\n${message}`,
      html: `
        <h3>Nova mensagem de suporte</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Categoria:</strong> ${category}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // Resposta automática pro usuário
    await sgMail.send({
      to: email,
      from: 'noreply@posturai.com.br',
      subject: 'Recebemos seu contato! - PosturAI',
      text: `Olá ${name},\n\nRecebemos sua mensagem e responderemos em até 48 horas.\n\nEquipe PosturAI`,
      html: `
        <h2>Olá ${name}!</h2>
        <p>Recebemos sua mensagem e nossa equipe responderá em até <strong>48 horas</strong>.</p>
        <p>Em caso de urgência, entre em contato via <a href="mailto:suporte@posturai.com.br">suporte@posturai.com.br</a>.</p>
        <p>Equipe PosturAI 💪</p>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro no suporte:', error);
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}