function AuthShell({ children }) {
  return (
    <section className="-min-h[calc(100vh-81px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">{children}</div>
    </section>
  );
}

export default AuthShell;
