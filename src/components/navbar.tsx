import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          🎓 Fiberan
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm hover:text-primary">
            Kurslar
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  {user.name ?? user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Öğrenme Paneli</Link>
                </DropdownMenuItem>
                {user.role === "INSTRUCTOR" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/instructor/courses">Kurslarım</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/instructor/analytics">Analizler</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/courses">Kurs Yönetimi</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button type="submit" className="w-full text-left">
                      Çıkış Yap
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Giriş</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
