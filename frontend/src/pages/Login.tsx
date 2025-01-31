import { Container, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { signupCredentials } from "../utils/interface";
import { setUser } from "../Redux/Slices/user-slice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const schema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(1, "password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<signupCredentials>({
    resolver: zodResolver(schema),
  });

  async function onsubmit(userData: signupCredentials) {
    try {
      const res = await useLogin(userData);
      reset();
      dispatch(setUser(res.data.user));
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "An unexpected error occurred"
      );
    }
  }
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mt: 10,
        height: "100vh",
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
      >
        Login Here
      </Typography>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-2 w-full"
      >
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              size="small"
              fullWidth
              sx={{
                margin: { xs: 0, md: "normal" },
              }}
              error={!!errors.email}
              helperText={
                errors?.email?.message ? String(errors.email.message) : ""
              }
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              size="small"
              sx={{
                margin: { xs: 0, md: "normal" },
              }}
              fullWidth
              error={!!errors.password}
              helperText={
                errors?.password?.message ? String(errors.password.message) : ""
              }
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isSubmitting ? (
            <CircularProgress color="secondary" size="25px" />
          ) : (
            "Login"
          )}
        </Button>
        <Typography sx={{ mt: 0.5, fontSize: "14px", textAlign: "center" }}>
          Don't have an accoun?<span> </span>
          <Link to="/signup" className="text-red-600 underline">
            Create account
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default Login;
