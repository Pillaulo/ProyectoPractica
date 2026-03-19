import { AppNav } from "@/components/app-nav";
import { AdminCreateUserForm } from "@/components/admin-create-user-form";
import { AdminUserDeleteButton } from "@/components/admin-user-delete-button";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminUsersPage() {
  const session = await getAdminSessionOrRedirect();

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { childProfiles: true, stories: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
        <section className="md:col-span-2">
          <h1 className="mb-6 text-2xl font-bold text-slate-900">Usuarios</h1>
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Perfiles</th>
                  <th className="px-4 py-3 text-left">Cuentos</th>
                  <th className="px-4 py-3 text-left">Creado</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 text-slate-900">{user.email}</td>
                    <td className="px-4 py-3 text-slate-800">
                      {user.role === "ADMIN" ? "Administrador" : "Tutor"}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {user.status === "ACTIVE" ? "Activo" : "Bloqueado"}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{user._count.childProfiles}</td>
                    <td className="px-4 py-3 text-slate-800">{user._count.stories}</td>
                    <td className="px-4 py-3 text-slate-800">
                      {new Date(user.createdAt).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-4 py-3">
                      <AdminUserDeleteButton
                        userId={user.id}
                        email={user.email}
                        disabled={user.id === session.user.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <AdminCreateUserForm />
          <div className="mt-3 rounded-xl bg-white p-4 text-xs text-slate-600 shadow-sm">
            Recomendación: crea administradores con contraseñas fuertes y cámbialas regularmente.
          </div>
        </section>
      </main>
    </div>
  );
}

