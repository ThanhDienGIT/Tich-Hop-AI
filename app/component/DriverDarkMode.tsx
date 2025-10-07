// File: app/component/ThemeSwitcher.tsx

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

export const DriverDarkMode = () => {
  const [mounted, setMounted] = useState(true);
  const { theme, setTheme } = useTheme();

  // Hàm mới để xử lý sự kiện thay đổi của Switch
  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <Switch
      checked={theme === "dark"}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};