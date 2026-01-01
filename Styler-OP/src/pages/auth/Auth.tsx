import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/label";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/authHooks";
import { clearError, login, signup , setError } from "../../redux/slice/authSlice";


function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {isLoading,isAuthenticated,error} = useAppSelector((state)=>state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [isAuthenticated,navigate]);

  useEffect(() => {
    dispatch(clearError());
    setEmail("");
    setUsername("");
    setPassword("");
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, username]);
  

  const handleSubmit = async(e:FormEvent)=> {
    e.preventDefault();

    if(!email || !password && password.length<8 ||(!isLogin && !username)){
      setError("please enter the required field");
      return;
    }
    try {
      if (isLogin) {
        await dispatch(login({email,password})).unwrap();
      } else {
        await dispatch(signup({username,email,password})).unwrap();
      }
      navigate("/home");
    } catch (error) {
      setError(
      "Something went wrong. Please try again."
      );
    }
    
  }


  return (
    <>
      <Helmet>
        <title>{isLogin ? "Login" : "Sign Up"} - StyleForge AI</title>
        <meta
          name="description"
          content={
            isLogin
              ? "Login to StyleForge AI and transform your photos"
              : "Create your StyleForge AI account"
          }
        />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md px-6">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          {/* Card */}
          <div className="card-premium p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start transforming your photos"}
              </p>
            </div>

            {/* Form */}

            <form onClick={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    User Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="enter your user name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 bg-secondary/50 border-border"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-border"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-secondary/50 border-border"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-foreground hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Auth;
