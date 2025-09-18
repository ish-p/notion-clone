import EmailPasswordForm from "@/components/auth/email_password_form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RegisterForm({
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
							<CardTitle className="text-xl">Welcome</CardTitle>
							<CardDescription>
								Enter your email and password to create an
								account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6">
								<EmailPasswordForm type="register" />
								<div className="text-center text-sm">
									Already have an account?{" "}
									<a
										href="/login"
										className="underline underline-offset-4"
									>
										Login
									</a>
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
