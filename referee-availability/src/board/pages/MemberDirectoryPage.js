import React from "react";
import "./MemberDirectoryPage.css";

const NoPhotoPlaceholder = () => (
  <div className="member-photo member-photo-placeholder" aria-label="No photo available">
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path
        d="M40 12c-8 0-14 6-14 14 0 5 3 9 7 11-6 2-11 8-11 15v4h36v-4c0-7-5-13-11-15 4-2 7-6 7-11 0-8-6-14-14-14z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M40 18a8 8 0 100 16 8 8 0 000-16z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
    <span>NO PHOTO AVAILABLE</span>
  </div>
);

const MemberPhoto = ({ member }) => {
  if (!member.hasPhoto) {
    return <NoPhotoPlaceholder />;
  }

  const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="member-photo member-photo-avatar" aria-hidden="true">
      <span>{initials}</span>
    </div>
  );
};

const MemberCard = ({ member, showRole }) => (
  <article className="member-card">
    <MemberPhoto member={member} />
    <div className="member-details">
      <div className="member-field">
        <span className="member-label">Name</span>
        <span className="member-value member-name">
          <strong>{member.firstName}</strong> {member.lastName}
        </span>
      </div>
      {showRole && member.role && (
        <div className="member-field">
          <span className="member-label">Role</span>
          <span className="member-value">{member.role}</span>
        </div>
      )}
      <div className="member-field">
        <span className="member-label">Primary Phone</span>
        <span className="member-value">{member.phone}</span>
      </div>
      <div className="member-field">
        <span className="member-label">Address</span>
        <span className="member-value">{member.address}</span>
      </div>
      <div className="member-field">
        <span className="member-label">City</span>
        <span className="member-value">{member.city}</span>
      </div>
      <div className="member-field">
        <span className="member-label">Province</span>
        <span className="member-value">{member.province}</span>
      </div>
      <div className="member-field">
        <span className="member-label">Postal Code</span>
        <span className="member-value">{member.postalCode}</span>
      </div>
      <div className="member-field">
        <span className="member-label">Email</span>
        <span className="member-value">
          <a href={`mailto:${member.email}`}>{member.email}</a>
        </span>
      </div>
      <div className="member-field">
        <span className="member-label">V-Card</span>
        <span className="member-value">
          <a href={`#vcard-${member.id}`} onClick={(e) => e.preventDefault()}>
            VCARD
          </a>
        </span>
      </div>
    </div>
  </article>
);

const MemberDirectoryPage = ({ title, subtitle, members, showRole = false }) => {
  return (
    <section className="board-page member-directory-page">
      <h1>{title}</h1>
      {subtitle && <p className="subtle">{subtitle}</p>}

      <div className="member-directory-grid">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} showRole={showRole} />
        ))}
      </div>
    </section>
  );
};

export default MemberDirectoryPage;
