import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import getSession from '@/api/getSession';

export default async function AuthenticationPage() {
  const { session } = await getSession();

  if (session) redirect('/dashboard');

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Connexion
      </Link>
      <div className="relative hidden h-full flex-col items-center justify-center bg-color1 p-10 text-white lg:flex ">
        <Image src="/logo.svg" width={300} height={300} alt="Logo" />
        <div dir="ltr" className="mt-5 text-center text-xl ">
          Transformons vos espaces en œuvres d’art.
        </div>
      </div>
      <div className="flex h-full items-center bg-color3 p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p className="text-sm text-muted-foreground">
              Entrez vos informations de compte ci-dessous pour vous connecter
            </p>
          </div>
          <UserAuthForm />
          {/*  <p className="px-8 text-center text-sm text-muted-foreground">
            En cliquant sur continuer, vous acceptez{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              les conditions d'utilisation
            </Link>{' '}
            et{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              la politique de confidentialité
            </Link>
            .
          </p>*/}
        </div>
      </div>
    </div>
  );
}
