import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaUserCircle, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// Query client for react-query (wrap the page with this provider)
const queryClient = new QueryClient();

// --- Small helper: fetch demo data ---
const fetchFeatures = async () => {
  // replace with your real endpoint if needed
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=3");
  return data;
};

function Features() {
  const { data, isLoading, error } = useQuery(["features"], fetchFeatures);

  if (isLoading) return <p className="text-sm text-muted">Loading features...</p>;
  if (error) return <p className="text-sm text-red-500">Failed to load features.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((f) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: f.id * 0.05 }}
          className="p-4 bg-white/5 rounded-2xl shadow-lg border border-white/5"
        >
          <h3 className="font-semibold">{f.title.slice(0, 40)}</h3>
          <p className="mt-2 text-sm text-muted">{f.body.slice(0, 80)}...</p>
        </motion.article>
      ))}
    </div>
  );
}

// --- Main page component ---
export default function ModernAnimatedPage({ onSubmitEndpoint }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({ mode: "onTouched" });
  const watchAvatar = watch("avatar");

  const submit = async (values) => {
    try {
      // If you want to upload files to a server or firebase, handle that here.
      // For demo we'll send form values (without file) to a placeholder endpoint if provided.
      const payload = { name: values.name, email: values.email, message: values.message };

      if (onSubmitEndpoint) {
        await axios.post(onSubmitEndpoint, payload);
      } else {
        // show a demo success modal
        await Swal.fire({ icon: "success", title: "Form Submitted", text: "This is a demo submit." });
      }

      reset();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Submit failed", text: String(err?.message || err) });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-tr from-[#071021] to-[#07112a] text-white p-6 md:p-12">
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-md">
              <FaUserCircle className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Your Product</h1>
              <p className="text-sm text-muted">Modern animated React page — ready to plug in</p>
            </div>
          </div>

          <nav className="hidden sm:flex gap-4 items-center">
            <a className="btn btn-ghost btn-sm">Docs</a>
            <a className="btn btn-ghost btn-sm">Pricing</a>
            <button
              onClick={() =>
                Swal.fire({
                  icon: "info",
                  title: "Tip",
                  text: "Pass an `onSubmitEndpoint` prop to submit the form to your backend.",
                })
              }
              className="btn btn-sm"
            >
              How to use
            </button>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Left: Hero */}
          <section className="lg:col-span-2 bg-white/3 rounded-3xl p-8 shadow-2xl border border-white/5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Build beautiful experiences — fast</h2>
                  <p className="mt-4 text-muted max-w-xl">
                    A compact, accessible page showcasing modern UI patterns with smooth micro-interactions using
                    Framer Motion, React Hook Form, and React Query. Drop in your API endpoints and tweak styles.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() =>
                        Swal.fire({ icon: "success", title: "Great choice", text: "You clicked Get started" })
                      }
                      className="btn btn-primary"
                    >
                      Get started
                    </button>

                    <button
                      onClick={() =>
                        Swal.fire({ icon: "info", title: "Demo", text: "This is a demo action — wire it to your router." })
                      }
                      className="btn btn-ghost"
                    >
                      Learn more
                    </button>
                  </div>
                </div>

                <motion.div
                  className="w-full sm:w-72 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 border border-white/5 shadow-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-cyan-600/20 flex items-center justify-center">
                      <FaCheckCircle className="w-7 h-7 text-cyan-300" />
                    </div>
                    <div>
                      <p className="font-semibold">Production-ready</p>
                      <p className="text-sm text-muted">Tiny footprint, easy to customize</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <dl className="grid grid-cols-2 gap-2 text-xs text-muted">
                      <div>
                        <dt className="font-medium">Tech</dt>
                        <dd>React · Tailwind · Framer</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Forms</dt>
                        <dd>React Hook Form</dd>
                      </div>

                      <div>
                        <dt className="font-medium">Data</dt>
                        <dd>React Query</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Alerts</dt>
                        <dd>SweetAlert2</dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Key features (live)</h3>
                <Features />
              </div>
            </motion.div>
          </section>

          {/* Right: Form */}
          <aside className="bg-white/4 rounded-3xl p-6 shadow-xl border border-white/5">
            <motion.h3 initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-lg font-bold">
              Contact / Join waitlist
            </motion.h3>

            <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Full name</span>
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Jane Doe"
                  className="input input-bordered w-full bg-transparent"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Provide a valid email" },
                  })}
                  placeholder="you@company.com"
                  className="input input-bordered w-full bg-transparent"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Tell us what you're building..."
                  className="textarea textarea-bordered w-full bg-transparent"
                />
              </div>

              <div className="border border-dashed p-3 rounded-xl flex items-center gap-3">
                <div className="flex-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <FaCloudUploadAlt className="w-6 h-6" />
                    <input {...register("avatar")} type="file" className="hidden" />
                    <span className="text-sm text-muted">Attach an optional file</span>
                  </label>

                  {watchAvatar && watchAvatar.length > 0 && (
                    <p className="text-xs mt-2">Selected: {watchAvatar[0].name}</p>
                  )}
                </div>

                <div>
                  <button type="button" onClick={() => Swal.fire("Upload", "Implement your upload flow here.", "info")} className="btn btn-sm btn-outline">
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button type="button" onClick={() => reset()} className="btn btn-ghost btn-sm">
                  Reset
                </button>
              </div>
            </form>

            <div className="mt-6 text-xs text-muted">
              <p>
                Pro tip: wire <code>onSubmitEndpoint</code> prop to your backend or call Firebase Storage / Cloud Functions to
                persist uploads.
              </p>
            </div>
          </aside>
        </main>

        <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-muted">
          <p>Made with ❤️ — drop this file into your React app and ensure Tailwind + DaisyUI are configured.</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

ModernAnimatedPage.propTypes = {
  onSubmitEndpoint: PropTypes.string,
};

ModernAnimatedPage.defaultProps = {
  onSubmitEndpoint: "",
};
