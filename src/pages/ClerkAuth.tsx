
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";

export default function ClerkAuth() {
  const [activeTab, setActiveTab] = useState<string>('signin');

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to GreenLoop</h1>
          <p className="text-muted-foreground">Join our eco-friendly community today</p>
        </div>

        <div className="eco-card p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignIn 
                fallbackRedirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-gradient-eco hover:opacity-90",
                    card: "shadow-none border-0 bg-transparent",
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUp 
                fallbackRedirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-gradient-eco hover:opacity-90",
                    card: "shadow-none border-0 bg-transparent",
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
