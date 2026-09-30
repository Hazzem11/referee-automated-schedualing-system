package com.example.referee.service;

import com.example.referee.model.Game;
import com.example.referee.model.Referee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Sends (or logs) notification emails. Live sending requires both
 * NOTIFICATIONS_ENABLED=true and SENDGRID_API_KEY; otherwise every email is
 * written to the backend console, which keeps demos fully offline-capable.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("EEE, MMM d");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    /** One game assignment as presented in a referee notification email. */
    public static class AssignmentNotice {
        public final Game game;
        public final String partnerName;

        public AssignmentNotice(Game game, String partnerName) {
            this.game = game;
            this.partnerName = partnerName;
        }
    }

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.notifications.enabled:false}")
    private boolean enabled;

    @Value("${app.notifications.from:assignments@demo.ovbabo.ca}")
    private String from;

    @Value("${app.notifications.from-name:OVBABO Assignments}")
    private String fromName;

    @Value("${app.notifications.assigner-emails:}")
    private String assignerEmails;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public NotificationService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public boolean isLive() {
        return enabled
            && mailPassword != null && !mailPassword.isBlank()
            && mailSenderProvider.getIfAvailable() != null;
    }

    /** One email per referee listing their newly published assignments. Returns referees notified. */
    public int sendAssignmentNotifications(Map<Referee, List<AssignmentNotice>> noticesByReferee) {
        int notified = 0;
        for (Map.Entry<Referee, List<AssignmentNotice>> entry : noticesByReferee.entrySet()) {
            Referee referee = entry.getKey();
            List<AssignmentNotice> notices = entry.getValue();
            if (referee.getEmail() == null || referee.getEmail().isBlank() || notices.isEmpty()) {
                continue;
            }
            String subject = notices.size() == 1
                ? "New game assignment: " + notices.get(0).game.getName()
                : notices.size() + " new game assignments";
            deliver(referee.getEmail(), subject, assignmentEmailHtml(referee, notices));
            notified++;
        }
        return notified;
    }

    /** Tell the crew of an already-published game that venue and/or time changed. */
    public void sendGameChangeNotification(Game game, String oldLocation, LocalDateTime oldStart,
                                           LocalDateTime oldEnd, boolean venueChanged, boolean timeChanged,
                                           List<Referee> referees) {
        StringBuilder what = new StringBuilder();
        if (venueChanged) what.append("venue");
        if (venueChanged && timeChanged) what.append(" and ");
        if (timeChanged) what.append("time");
        String subject = "Game updated (" + what + "): " + game.getName();

        for (Referee referee : referees) {
            if (referee.getEmail() == null || referee.getEmail().isBlank()) {
                continue;
            }
            deliver(referee.getEmail(), subject,
                gameChangeEmailHtml(referee, game, oldLocation, oldStart, oldEnd, venueChanged, timeChanged));
        }
    }

    /** Coverage summary sent to the assigner inbox(es) after each publish. */
    public void sendAssignerDigest(int totalGames, int fullyStaffed, int unassignedSlots,
                                   List<Game> understaffedGames, int refereesNotified) {
        List<String> recipients = Arrays.stream(assignerEmails.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
        if (recipients.isEmpty()) {
            log.info("[EMAIL] No assigner emails configured (ASSIGNER_EMAILS) — digest skipped.");
            return;
        }
        String subject = "Assignments published — " + fullyStaffed + "/" + totalGames + " games fully staffed";
        String html = digestEmailHtml(totalGames, fullyStaffed, unassignedSlots, understaffedGames, refereesNotified);
        for (String recipient : recipients) {
            deliver(recipient, subject, html);
        }
    }

    private void deliver(String to, String subject, String html) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (!isLive() || mailSender == null) {
            log.info("[EMAIL log-only] To: {} | Subject: {}\n{}", to, subject, htmlToText(html));
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("[EMAIL sent] To: {} | Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("[EMAIL failed] To: {} | Subject: {} | Reason: {}", to, subject, e.getMessage());
            log.info("[EMAIL fallback] To: {} | Subject: {}\n{}", to, subject, htmlToText(html));
        }
    }

    private String assignmentEmailHtml(Referee referee, List<AssignmentNotice> notices) {
        StringBuilder rows = new StringBuilder();
        for (AssignmentNotice notice : notices) {
            Game g = notice.game;
            rows.append("<tr>")
                .append(cell(formatDate(g.getStartTime())))
                .append(cell(formatTimeRange(g.getStartTime(), g.getEndTime())))
                .append(cell(escape(g.getLocation())))
                .append(cell(escape(g.getLevel() != null && !g.getLevel().isBlank() ? g.getLevel() : "Level " + g.getGameLevel())))
                .append(cell(notice.partnerName != null ? escape(notice.partnerName) : "TBD"))
                .append("</tr>");
        }
        return page("You have " + notices.size() + " new assignment" + (notices.size() == 1 ? "" : "s"),
            "<p>Hi " + escape(firstName(referee.getName())) + ",</p>"
                + "<p>You have been assigned to the following game" + (notices.size() == 1 ? "" : "s") + ":</p>"
                + "<table style=\"border-collapse:collapse;width:100%;\">"
                + "<tr>" + headerCell("Date") + headerCell("Time") + headerCell("Venue") + headerCell("Level") + headerCell("Crew partner") + "</tr>"
                + rows
                + "</table>"
                + "<p>Please log in to the members' site to confirm your assignments.</p>");
    }

    private String gameChangeEmailHtml(Referee referee, Game game, String oldLocation,
                                       LocalDateTime oldStart, LocalDateTime oldEnd,
                                       boolean venueChanged, boolean timeChanged) {
        StringBuilder changes = new StringBuilder();
        if (venueChanged) {
            changes.append("<tr>").append(cell("Venue"))
                .append(cell(escape(oldLocation)))
                .append(cell("<strong>" + escape(game.getLocation()) + "</strong>"))
                .append("</tr>");
        }
        if (timeChanged) {
            changes.append("<tr>").append(cell("Date & time"))
                .append(cell(formatDate(oldStart) + ", " + formatTimeRange(oldStart, oldEnd)))
                .append(cell("<strong>" + formatDate(game.getStartTime()) + ", "
                    + formatTimeRange(game.getStartTime(), game.getEndTime()) + "</strong>"))
                .append("</tr>");
        }
        return page("Game update — action may be required",
            "<p>Hi " + escape(firstName(referee.getName())) + ",</p>"
                + "<p>A game you are assigned to has changed:</p>"
                + "<p><strong>" + escape(game.getName()) + "</strong></p>"
                + "<table style=\"border-collapse:collapse;width:100%;\">"
                + "<tr>" + headerCell("") + headerCell("Was") + headerCell("Now") + "</tr>"
                + changes
                + "</table>"
                + "<p>If you can no longer make this game, please contact the assigner as soon as possible.</p>");
    }

    private String digestEmailHtml(int totalGames, int fullyStaffed, int unassignedSlots,
                                   List<Game> understaffedGames, int refereesNotified) {
        StringBuilder body = new StringBuilder()
            .append("<p>The latest assignment run has been published.</p>")
            .append("<ul>")
            .append("<li><strong>").append(fullyStaffed).append(" / ").append(totalGames)
            .append("</strong> games fully staffed</li>")
            .append("<li><strong>").append(unassignedSlots).append("</strong> open crew slot(s)</li>")
            .append("<li><strong>").append(refereesNotified).append("</strong> referee(s) notified</li>")
            .append("</ul>");
        if (!understaffedGames.isEmpty()) {
            body.append("<p>Games still needing officials:</p>")
                .append("<table style=\"border-collapse:collapse;width:100%;\">")
                .append("<tr>").append(headerCell("Game")).append(headerCell("Date")).append(headerCell("Venue")).append("</tr>");
            for (Game g : understaffedGames) {
                body.append("<tr>")
                    .append(cell(escape(g.getName())))
                    .append(cell(formatDate(g.getStartTime()) + " " + formatTimeRange(g.getStartTime(), g.getEndTime())))
                    .append(cell(escape(g.getLocation())))
                    .append("</tr>");
            }
            body.append("</table>");
        }
        return page("Publish summary", body.toString());
    }

    private static String page(String heading, String content) {
        return "<div style=\"font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a;\">"
            + "<div style=\"background:#0b3d91;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;\">"
            + "<strong style=\"font-size:16px;\">OVBABO Assignments</strong></div>"
            + "<div style=\"border:1px solid #ddd;border-top:none;padding:20px;border-radius:0 0 8px 8px;\">"
            + "<h2 style=\"margin-top:0;font-size:18px;\">" + escape(heading) + "</h2>"
            + content
            + "<p style=\"color:#777;font-size:12px;margin-top:24px;\">Ottawa Valley Board of Approved Basketball Officials — automated notification</p>"
            + "</div></div>";
    }

    private static String cell(String content) {
        return "<td style=\"border:1px solid #ddd;padding:8px;font-size:14px;\">" + content + "</td>";
    }

    private static String headerCell(String content) {
        return "<th style=\"border:1px solid #ddd;padding:8px;font-size:14px;background:#f2f5fa;text-align:left;\">"
            + escape(content) + "</th>";
    }

    private static String formatDate(LocalDateTime time) {
        return time != null ? time.format(DATE_FMT) : "";
    }

    private static String formatTimeRange(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return "";
        }
        return start.format(TIME_FMT) + " – " + end.format(TIME_FMT);
    }

    private static String firstName(String name) {
        if (name == null || name.isBlank()) {
            return "Referee";
        }
        return name.trim().split("\\s+")[0];
    }

    private static String escape(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private static String htmlToText(String html) {
        return html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
    }
}
