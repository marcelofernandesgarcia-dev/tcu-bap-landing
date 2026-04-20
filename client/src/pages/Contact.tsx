'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const notifyOwner = trpc.system.notifyOwner.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    try {
      // Send notification to owner
      await notifyOwner.mutateAsync({
        title: `Novo Contato: ${formData.subject}`,
        content: `
De: ${formData.name}
Email: ${formData.email}
Organização: ${formData.organization || 'Não informada'}
Assunto: ${formData.subject}

Mensagem:
${formData.message}
        `
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        organization: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Erro ao enviar mensagem. Por favor, tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold mb-2">Fale Conosco</h1>
          <p className="text-blue-100">Envie suas dúvidas, sugestões ou reporte erros sobre o conteúdo</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                <a href="mailto:stce@tcu.gov.br" className="text-blue-600 hover:underline">
                  stce@tcu.gov.br
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Telefone</h3>
                <p className="text-slate-600">(61) 3316-7000</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Endereço</h3>
                <p className="text-slate-600">Brasília - DF</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Envie sua Mensagem</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Mensagem enviada com sucesso!</p>
                <p className="text-sm text-green-700">Obrigado por entrar em contato. Responderemos em breve.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Erro ao enviar</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nome Completo *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                className="w-full"
              />
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-sm font-semibold text-slate-700 mb-2">
                Órgão/Organização
              </label>
              <Input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Ex: Ministério da Educação"
                className="w-full"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                Assunto *
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Dúvida, sugestão ou erro"
                className="w-full"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                Mensagem *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Descreva sua dúvida, sugestão ou erro encontrado..."
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={notifyOwner.isPending}
                className="flex-1"
              >
                {notifyOwner.isPending ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    organization: ''
                  });
                  setError('');
                }}
              >
                Limpar
              </Button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-slate-700">
              <strong>Informação:</strong> Suas mensagens serão recebidas pela equipe do SIACT e respondidas conforme possível. Para assuntos urgentes, entre em contato diretamente pelo telefone ou email acima.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
