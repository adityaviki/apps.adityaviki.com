"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await register(formData);
    },
    undefined
  );

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-xl shadow-primary/5 border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <p className="text-sm text-muted-foreground">Start capturing your thoughts</p>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
              className="rounded-xl"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full rounded-xl h-11 text-sm font-semibold shadow-md shadow-primary/20" disabled={pending}>
            {pending ? "Creating account..." : "Get Started"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
