import { Container, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { signupCredentials } from "../utils/interface";
import toast from "react-hot-toast";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slices/user-slice";
import CircularProgress from "@mui/material/CircularProgress";

const schema = z
  .object({
    fullname: z.string().nonempty("Fullname is required"),
    username: z.string().nonempty("username is required"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "password must be 6 characters long"),
    confirmPassword: z.string().nonempty("confrim password is required"),
    gender: z.enum(["male", "female"], {
      required_error: "Select your gender",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirm password must match",
    path: ["confirmPassword"],
  });

const Signup = () => {
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
      const res = await useSignup(userData);
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
        justifyContent: "center",
        mt: 0,
        height: "100vh",
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
      >
        Create Account
      </Typography>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-2 w-full"
      >
        <Controller
          name="fullname"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name"
              size="small"
              fullWidth
              sx={{
                margin: { xs: 0, md: "normal" },
              }}
              error={!!errors.fullname}
              helperText={
                errors?.fullname?.message ? String(errors.fullname.message) : ""
              }
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="User Name"
              size="small"
              fullWidth
              sx={{
                margin: { xs: 0, md: "normal" },
              }}
              error={!!errors.username}
              helperText={
                errors?.username?.message ? String(errors.username.message) : ""
              }
            />
          )}
        />
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
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              fullWidth
              size="small"
              sx={{
                margin: { xs: 0, md: "normal" },
              }}
              error={!!errors.confirmPassword}
              helperText={
                errors?.confirmPassword?.message
                  ? String(errors.confirmPassword.message)
                  : ""
              }
            />
          )}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl error={!!errors.gender}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row {...field}>
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
              {errors.gender && (
                <Typography
                  className="text-red-600"
                  sx={{ fontSize: "14px", ml: 2, mt: -1 }}
                >
                  select your gender{" "}
                </Typography>
              )}
            </FormControl>
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
            "Create Account"
          )}
        </Button>
        <Typography sx={{ mt: 0.5, fontSize: "14px", textAlign: "center" }}>
          Already have an accoun?<span> </span>
          <Link to="/login" className="text-red-600 underline">
            Login
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default Signup;
