import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import EmailPasswordForm from "./email_password_form";
import OauthForm from "./oauth_form";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm text-center">
				<div
					className={cn("flex flex-col gap-6", className)}
					{...props}
				>
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">
								Welcome back
							</CardTitle>
							<CardDescription>
								Login with your OAuth account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6">
								<OauthForm />
								<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-card text-muted-foreground relative z-10 px-2">
										Or continue with
									</span>
								</div>
								<EmailPasswordForm type="login" />
								<div className="text-center text-sm">
									Don&apos;t have an account?{" "}
									<Link
										href="/register"
										className="underline underline-offset-4"
									>
										Sign up
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
					<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
						By using this service, you agree to our{" "}
						<Link href="/info/tos">Terms of Service</Link> and{" "}
						<Link href="/info/privacy">Privacy Policy</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
