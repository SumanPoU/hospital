import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="py-20 flex items-center justify-center bg-background source-serif-text">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have the required permissions to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This page requires admin or editor privileges. Please contact your
              administrator if you believe this is an error.
            </p>
            <div className="flex w-full  gap-2">
              <Button asChild className="w-1/2">
                <Link href="/dashboard/user">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild className="w-1/2">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
