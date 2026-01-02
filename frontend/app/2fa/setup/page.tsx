'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { authStorage } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SetupTwoFAPage() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const load = async () => {
      try {
        const setup = await apiClient.enableTwoFA();
        setSecret(setup.secret);
        setQrCode(setup.qrCode);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start 2FA setup';
        const status = (err as { status?: number })?.status;
        setError(message);
        if (status === 401 || message.toLowerCase().includes('unauthorized')) {
          router.replace('/login');
        }
      }
    };

    load();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiClient.verifyTwoFA(code);
      authStorage.setToken(res.token);
      setMessage('Two-factor authentication enabled!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Enable Two-Factor Authentication</CardTitle>
          <CardDescription>Scan the QR code with Google Authenticator or Authy, then verify with the code.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-center bg-muted/10">
              {qrCode ? (
                <Image
                  src={qrCode}
                  alt="2FA QR code"
                  width={256}
                  height={256}
                  className="mx-auto h-64 w-64"
                />
              ) : (
                <p className="text-muted-foreground text-sm">Generating QR code...</p>
              )}
            </div>
            {secret && (
              <div className="text-sm text-muted-foreground">
                Manual entry code: <span className="font-mono text-foreground">{secret}</span>
              </div>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleVerify}>
            <div className="space-y-2">
              <Label htmlFor="code">Enter 6-digit code</Label>
              <Input
                id="code"
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Back to dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
