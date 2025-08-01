import { Button } from "@/components/ui/button";

function changeTheme(themeName: string) {
  document.documentElement.setAttribute("data-theme", themeName);
}

export default function Theme() {
  return (
    <div className="flex gap-2">
      <Button onClick={() => changeTheme("green")}>Green</Button>
      <Button onClick={() => changeTheme("rainforest")}>Rainforest</Button>
      <Button onClick={() => changeTheme("candy")}>Candy</Button>
      <Button onClick={() => changeTheme("blue")}>Blue</Button>
      <Button onClick={() => changeTheme("red")}>Red</Button>
      <Button onClick={() => changeTheme("yellow")}>Yellow</Button>
      <Button onClick={() => changeTheme("pink")}>Pink</Button>
      <Button onClick={() => changeTheme("purple")}>Purple</Button>
      <Button onClick={() => changeTheme("orange")}>Orange</Button>
      <Button onClick={() => changeTheme("dark")}>Dark</Button>
    </div>
  );
}
