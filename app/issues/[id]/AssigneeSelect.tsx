"use client";

import { User } from "@/generated/prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";

const AssigneeSelect = () => {
  const [assigneeId, setAssignedId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: users } = await axios.get<User[]>("/api/users/");
      setUsers(users);
    };

    fetchUsers();
  }, []);

  return (
    <Select.Root
      value={assigneeId ?? ""}
      onValueChange={(value) => {
        setAssignedId(value === "unassigned" ? null : value);
      }}
    >
      <Select.Trigger placeholder="Assign Owner" />
      <Select.Content>
        <Select.Group>
          <Select.Item value="unassigned">Unassigned</Select.Item>
          {users.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
