import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";

export default function EditarUsuarioDrawer({
  isOpen,
  onOpenChange,
  userToEdit,
  onEditUser,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit: any;
  onEditUser: (user: any) => void;
}) {
  const [editUser, setEditUser] = React.useState({
    id:"",
    name: "",
    username: "",
    email: "",
    role: "asesor",
    password: "",
  });
  const [success, setSuccess] = React.useState(false);

  // Inicializa los datos al abrir el drawer
  React.useEffect(() => {
    if (userToEdit) {
      setEditUser({
        id: userToEdit.id || "",
        name: userToEdit.name || "",
        username: userToEdit.username || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "asesor",
        password: userToEdit.password || "",
      });
    }
  }, [userToEdit, isOpen]);

  // Actualiza password automáticamente cuando cambia el nombre
  React.useEffect(() => {
    setEditUser((prev) => ({
      ...prev,
      password: editUser.password,
    }));
  }, [editUser.name]);

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
              Editar Usuario
            </DrawerHeader>
            <DrawerBody>
              {success && (
                <div className="mb-2 p-2 rounded bg-green-700 text-green-100 text-center">
                  Usuario editado correctamente
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onEditUser(editUser);
                  setSuccess(true);
                  onClose();
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Nombre"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Correo"
                  className="rounded p-2 bg-[#232336] text-blue-100 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  required
                />
                <select
                  className="rounded p-2 bg-[#232336] text-blue-100 focus:ring-2 focus:ring-blue-500"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
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
                  value={editUser.password}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
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
                  onEditUser(editUser);
                  setSuccess(true);
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
