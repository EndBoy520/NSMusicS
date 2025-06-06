package controller_app_library

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_library"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AppMediaFileLibraryController struct {
	usecase domain_app_library.AppMediaFileLibraryUsecase
}

func NewAppMediaFileLibraryController(uc domain_app_library.AppMediaFileLibraryUsecase) *AppMediaFileLibraryController {
	return &AppMediaFileLibraryController{usecase: uc}
}

func (ctrl *AppMediaFileLibraryController) ReplaceAll(c *gin.Context) {
	var req []*domain_app_library.AppMediaFileLibrary
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	if err := ctrl.usecase.ReplaceAll(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "app config updated"})
}

func (ctrl *AppMediaFileLibraryController) GetAll(c *gin.Context) {
	configs, err := ctrl.usecase.GetAll(c.Request.Context())
	if err != nil {
		if errors.Is(err, domain.ErrEmptyCollection) {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, configs)
}
