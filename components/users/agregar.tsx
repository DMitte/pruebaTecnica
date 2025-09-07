import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";

function generarPassword(nombre: string) {
  if (!nombre) return "";
  const partes = nombre.trim().split(" ");
  const inicial = partes[0]?.charAt(0).toUpperCase() || "";
  const apellido = partes[1] ? partes[1] : partes[0];
  const fecha = new Date();
  const year = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${inicial}${apellido}${year}${mes}`;
}

export default function AgregarUsuarioDrawer({
  isOpen,
  onOpenChange,
  onAddUser,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: any) => void;
}) {
  const [newUser, setNewUser] = React.useState({
    name: "",
    username: "",
    email: "",
    role: "asesor",
    password: "",
  });
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    setNewUser((prev) => ({
      ...prev,
      password: generarPassword(prev.name),
    }));
  }, [newUser.name]);

  // Oculta el mensaje después de 2.5 segundos
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              Agregar Usuario
            </DrawerHeader>
            <DrawerBody>
              {success && (
                <div className="mb-2 p-2 rounded bg-green-700 text-green-100 text-center">
                  Usuario creado correctamente
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddUser(newUser);
                  setSuccess(true);
                  setNewUser({
                    name: "",
                    username: "",
                    email: "",
                    role: "asesor",
                    password: "",
                  });
                  onClose();
                }}
                className="flex flex-col gap-4"
              >
                {/* ...inputs como ya tienes... */}
                <input
                  type="text"
                  placeholder="Nombre"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Correo"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
                <select
                  className="rounded p-2 bg-[#232336] text-blue-100 focus:ring-2 focus:ring-blue-500"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="asesor">Asesor</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
                <input
                  type="text"
                  placeholder="Contraseña generada"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={newUser.password}
                  readOnly
                />
              </form>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onAddUser(newUser);
                  setSuccess(true);
                  setNewUser({
                    name: "",
                    username: "",
                    email: "",
                    role: "asesor",
                    password: "",
                  });
                  onClose();
                }}
              >
                Guardar
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}