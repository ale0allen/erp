package br.com.erp.auditoria;

/**
 * Identificadores estáveis de ações registradas no histórico de auditoria.
 */
public final class AuditoriaHistoricoAcoes {

    private AuditoriaHistoricoAcoes() {
    }

    public static final String USER_CREATED = "USER_CREATED";
    public static final String USER_UPDATED = "USER_UPDATED";
    public static final String USER_INACTIVATED = "USER_INACTIVATED";
    public static final String USER_ROLE_CHANGED = "USER_ROLE_CHANGED";
    public static final String SETTINGS_UPDATED = "SETTINGS_UPDATED";
    public static final String PURCHASE_COMPLETED = "PURCHASE_COMPLETED";
    public static final String SALE_COMPLETED = "SALE_COMPLETED";
}
