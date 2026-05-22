import { useMemo, useState } from "react";
import type { AdminGame } from "../../../store/slices/games";

export type GameFormState = {
  key: string;
  title: string;
  description: string;
};

const emptyForm: GameFormState = {
  key: "",
  title: "",
  description: "",
};

export const useGameForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [form, setForm] = useState<GameFormState>(emptyForm);

  const openCreate = () => {
    setEditingGame(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (game: AdminGame) => {
    setEditingGame(game);
    setForm({
      key: game.key || "",
      title: game.title || "",
      description: game.description || "",
    });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingGame(null);
  };

  const payload = useMemo(
    () => ({
      key: form.key.trim(),
      title: form.title.trim(),
      ...(form.description.trim()
        ? { description: form.description.trim() }
        : {}),
    }),
    [form],
  );

  return {
    isOpen,
    editingGame,
    form,
    setForm,
    openCreate,
    openEdit,
    close,
    payload,
  };
};
