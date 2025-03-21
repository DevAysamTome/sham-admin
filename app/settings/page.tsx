"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase"; // عدّل المسار حسب مشروعك

interface SocialLink {
  type: string;
  url: string;
}

export default function SocialLinksAdmin() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [newType, setNewType] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // نستخدمه لجلب الروابط من Firestore
  async function fetchSocialLinks() {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "socialLinks"); // مستند محدد
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() as { links: SocialLink[] };
        setLinks(data.links || []);
      } else {
        // إذا لم يوجد المستند، يمكن إنشاؤه لاحقًا
        setLinks([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("خطأ في جلب روابط التواصل:", err);
      setLoading(false);
    }
  }

  // جلب الروابط عند التحميل
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  // إضافة رابط جديد إلى القائمة (محليًا)
  function handleAddLink(e: FormEvent) {
    e.preventDefault();
    if (!newType.trim() || !newUrl.trim()) return;

    const newLink: SocialLink = {
      type: newType.trim(),
      url: newUrl.trim(),
    };
    setLinks((prev) => [...prev, newLink]);
    setNewType("");
    setNewUrl("");
  }

  // حذف رابط من القائمة (محليًا)
  function handleDeleteLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // حفظ التغييرات في Firestore
  async function handleSaveChanges() {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "socialLinks");
      await setDoc(docRef, { links }); 
      // سيستبدل كامل محتوى المستند بـ { links: [...] }

      alert("تم حفظ التغييرات بنجاح!");
      setLoading(false);
    } catch (err) {
      console.error("خطأ في حفظ الروابط:", err);
      alert("حدث خطأ أثناء حفظ التغييرات.");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>إدارة روابط التواصل الاجتماعي</h1>

      {loading && <p>جاري التحميل...</p>}

      {/* قائمة الروابط */}
      {!loading && links.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((link, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                background: "#f1f1f1",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <div>
                <strong>النوع:</strong> {link.type} <br />
                <strong>الرابط:</strong> {link.url}
              </div>
              <button
                style={{
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: "6px 12px",
                }}
                onClick={() => handleDeleteLink(index)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && links.length === 0 && (
        <p style={{ marginBottom: 20 }}>لا توجد روابط حاليًا.</p>
      )}

      {/* نموذج إضافة رابط جديد */}
      <form
        onSubmit={handleAddLink}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <label>
          النوع (facebook, instagram...):
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          الرابط (URL):
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            padding: "10px 16px",
            alignSelf: "flex-start",
          }}
        >
          إضافة
        </button>
      </form>

      {/* زر حفظ التغييرات */}
      <button
        onClick={handleSaveChanges}
        style={{
          background: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          padding: "10px 16px",
        }}
        disabled={loading}
      >
        حفظ التغييرات
      </button>
    </div>
  );
}
