package com.ecogarzones.event.integration;

import java.time.LocalDateTime;

public interface CalendarService {
    /**
     * Sincroniza un banquete corporativo en el calendario de Google / Outlook del cliente.
     */
    void syncEvent(String calendarId, String title, String description, LocalDateTime startTime, LocalDateTime endTime);
}
