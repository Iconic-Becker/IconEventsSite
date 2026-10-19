import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { get, post } from "../shared/api.js"
import { Spinner } from "../shared/ui.jsx"
import { Login } from "./Login.jsx"
import { GalleriesList } from "./GalleriesList.jsx"
import { GalleryEditor } from "./GalleryEditor.jsx"
import { Users } from "./Users.jsx"

const Me = createContext(null)
export const useMe = () => useContext(Me)

export default function AdminApp() {
  const [me, setMe] = useState(undefined)
  const [needsSetup, setNeedsSetup] = useState(false)
  const refresh = useCallback(() => get("/api/admin/me").then((d) => { setMe(d.user); setNeedsSetup(d.needsSetup) }).catch(() => setMe(null)), [])
  useEffect(() => {
    refresh()
    document.title = "Iconic Photos admin"
    // The admin is always light, down to the page edges.
    document.documentElement.classList.add("theme-light")
    return () => document.documentElement.classList.remove("theme-light")
  }, [refresh])
  if (me === undefined) {
    return (
      <div className="theme-light u-bg u-fg flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!me) return <Login onLogin={refresh} needsSetup={needsSetup} />
  return (
    <Me.Provider value={{ me, refresh }}>
      <div className="theme-light u-bg u-fg min-h-svh">
        <Nav />
        <Routes>
          <Route index element={<GalleriesList />} />
          <Route path="galleries/:id/*" element={<GalleryEditor />} />
          <Route path="users" element={me.role === "owner" ? <Users /> : <Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Me.Provider>
  )
}

function Nav() {
  const { me } = useMe()
  const navigate = useNavigate()
  const logout = async () => {
    await post("/api/admin/logout")
    navigate(0)
  }
  const link = ({ isActive }) => `px-3 py-2 text-[11px] tracking-[0.16em] uppercase border-b-2 ${isActive ? "border-[var(--accent)]" : "border-transparent u-muted hover:u-fg"}`
  return (
    <header className="border-b u-line" style={{ background: "var(--bg-2)" }}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/admin" className="flex items-center gap-3 py-3">
          <img src="/brand/logo-black.png" alt="Iconic Events" className="h-6 w-auto" />
          <span className="eyebrow hidden sm:inline">Photos</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 self-stretch">
          <NavLink to="/admin" end className={link}>Galleries</NavLink>
          {me.role === "owner" && <NavLink to="/admin/users" className={link}>Users</NavLink>}
          <a href="/api/admin/guests.csv" className={link({ isActive: false })}>Guests CSV</a>
        </nav>
        <div className="flex items-center gap-3 text-xs u-muted">
          <span className="hidden sm:inline">{me.name || me.email} · {me.role}</span>
          <button className="icon-btn" onClick={logout} aria-label="Sign out" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
